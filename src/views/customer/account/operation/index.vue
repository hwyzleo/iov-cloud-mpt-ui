<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="账号ID" prop="accountId">
        <el-input
          v-model="queryParams.accountId"
          placeholder="请输入账号ID"
          clearable
          style="width: 220px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="注册来源" prop="status">
        <el-select
          v-model="queryParams.regSource"
          placeholder="注册来源"
          clearable
          style="width: 120px"
        >
          <el-option
            v-for="dict in dict.type.iov_reg_source"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.enable"
          placeholder="账号状态"
          clearable
          style="width: 120px"
        >
          <el-option key="1" label="正常" value="1"/>
          <el-option key="0" label="停用" value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['user:account:account:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['user:account:account:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['user:account:account:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['user:account:account:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="accountList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="账号ID" prop="accountId" width="200"/>
      <el-table-column label="手机号" prop="mobile" width="120"/>
      <el-table-column label="昵称" prop="nickname" width="150"/>
      <el-table-column label="性别" prop="gender" width="100">
        <template slot-scope="scope">
          <span>{{ getGenderLabel(scope.row.gender) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册来源" prop="regSource" width="100">
        <template slot-scope="scope">
          <span>{{ getRegSourceLabel(scope.row.regSource) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :active-value="true"
            :inactive-value="false"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.roleId !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['user:account:account:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['user:account:account:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改账号配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.roleName" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.enable">
            <el-radio
              key="1"
              label="1"
            >正常
            </el-radio>
            <el-radio
              key="0"
              label="0"
            >停用
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAccount,
  getAccount,
  addAccount,
  updateAccount,
  delAccount
} from "@/api/customer/account/operation";
import {getBrand} from "@/api/completevehicle/product/brand";

export default {
  name: "Account",
  dicts: ['iov_user_gender', 'iov_reg_source'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 账号表格数据
      accountList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mobile: [
          {required: true, message: "手机号不能为空", trigger: "blur"}
        ],
        enable: [
          {required: true, message: "状态不能为空", trigger: "blur"}
        ]
      }
    };
  },
  created() {
    this.queryParams.accountId = this.$route.query.accountId;
    this.getList();
  },
  methods: {
    /** 查询账号列表 */
    getList() {
      this.loading = true;
      listAccount(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.accountList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 获取性别
    getGenderLabel(gender) {
      if (!this.dict || !this.dict.type || !this.dict.type.iov_user_gender) {
        return gender;
      }
      const item = this.dict.type.iov_user_gender.find(
        dict => dict.value === gender
      )
      return item ? item.label : gender
    },
    // 获取注册来源
    getRegSourceLabel(regSource) {
      if (!this.dict || !this.dict.type || !this.dict.type.iov_reg_source) {
        return regSource;
      }
      const item = this.dict.type.iov_reg_source.find(
        dict => dict.value === regSource
      )
      return item ? item.label : regSource
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        accountId: undefined,
        mobile: undefined,
        regSource: undefined,
        enable: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加账号";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const accountId = row.id || this.ids
      getAccount(accountId).then(response => {
        this.form = response.data;
        this.open = true;
      });
      this.title = "修改账号";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateAccount(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAccount(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const accountIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除账号ID为"' + accountIds + '"的数据项？').then(function () {
        return delAccount(accountIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('tsp-account/mpt/account/export', {
        ...this.queryParams
      }, `account_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
