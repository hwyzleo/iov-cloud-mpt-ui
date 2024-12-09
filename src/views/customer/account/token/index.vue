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
      <el-form-item label="客户端ID" prop="clientId">
        <el-input
          v-model="queryParams.clientId"
          placeholder="请输入客户端ID"
          clearable
          style="width: 300px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户端类型" prop="clientType">
        <el-select
          v-model="queryParams.clientType"
          placeholder="客户端类型"
          clearable
          style="width: 120px"
        >
          <el-option
            v-for="dict in dict.type.iov_client_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车架号" prop="vin">
        <el-input
          v-model="queryParams.vin"
          placeholder="请输入车架号"
          clearable
          style="width: 180px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="访问令牌" prop="accessToken">
        <el-input
          v-model="queryParams.accessToken"
          placeholder="请输入访问令牌"
          clearable
          style="width: 540px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发行时间">
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
          v-hasPermi="['user:account:token:add']"
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
          v-hasPermi="['user:account:token:edit']"
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
          v-hasPermi="['user:account:token:remove']"
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
          v-hasPermi="['user:account:token:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tokenList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="账号ID" prop="accountId" width="120"/>
      <el-table-column label="客户端ID" prop="clientId" width="160"/>
      <el-table-column label="客户端类型" prop="clientType" width="100">
        <template slot-scope="scope">
          <span>{{ getClientTypeLabel(scope.row.clientType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车架号" prop="vin" width="150"/>
      <el-table-column label="访问令牌" prop="accessToken" width="300"/>
      <el-table-column label="发行时间" align="center" prop="issueTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.issueTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.roleId !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['user:account:token:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['user:account:token:remove']"
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
        <el-form-item label="账号ID" prop="accountId">
          <el-input v-model="form.accountId" placeholder="请输入账号ID"/>
        </el-form-item>
        <el-form-item label="客户端ID" prop="clientId">
          <el-input v-model="form.clientId" placeholder="请输入客户端ID"/>
        </el-form-item>
        <el-form-item label="客户端类型" prop="clientType">
          <el-input v-model="form.clientType" placeholder="请输入客户端类型"/>
        </el-form-item>
        <el-form-item label="车架号" prop="vin">
          <el-input v-model="form.vin" placeholder="请输入车架号"/>
        </el-form-item>
        <el-form-item label="访问令牌" prop="accessToken">
          <el-input v-model="form.accessToken" placeholder="请输入访问令牌"/>
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
  listToken,
  getToken,
  addToken,
  updateToken,
  delToken
} from "@/api/customer/account/token";

export default {
  name: "Token",
  dicts: ['iov_client_type'],
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
      tokenList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        accountId: [
          {required: true, message: "账号ID不能为空", trigger: "blur"}
        ],
        clientId: [
          {required: true, message: "客户端ID不能为空", trigger: "blur"}
        ],
        clientType: [
          {required: true, message: "客户端类型不能为空", trigger: "blur"}
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询令牌列表 */
    getList() {
      this.loading = true;
      listToken(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.tokenList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 获取客户端类型
    getClientTypeLabel(clientType) {
      if (!this.dict || !this.dict.type || !this.dict.type.iov_client_type) {
        return clientType;
      }
      const item = this.dict.type.iov_client_type.find(
        dict => dict.value === clientType
      )
      return item ? item.label : genclientTypeder
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
        clientId: undefined,
        clientType: undefined,
        vin: undefined
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
      this.title = "添加令牌";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const tokenId = row.id || this.ids
      getToken(tokenId).then(response => {
        this.form = response.data;
        this.open = true;
      });
      this.title = "修改令牌";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateToken(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addToken(this.form).then(response => {
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
      const tokenIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除令牌ID为"' + tokenIds + '"的数据项？').then(function () {
        return delToken(tokenIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('tsp-account/mpt/token/export', {
        ...this.queryParams
      }, `token_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
