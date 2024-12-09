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
      <el-form-item label="最后登录时间">
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
          v-hasPermi="['user:account:client:add']"
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
          v-hasPermi="['user:account:client:edit']"
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
          v-hasPermi="['user:account:client:remove']"
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
          v-hasPermi="['user:account:client:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="clientList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="账号ID" prop="accountId" width="200"/>
      <el-table-column label="客户端ID" prop="clientId" width="300"/>
      <el-table-column label="推送注册ID" prop="pushRegId" width="150"/>
      <el-table-column label="客户端类型" prop="clientType" width="100">
        <template slot-scope="scope">
          <span>{{ getClientTypeLabel(scope.row.clientType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录IP" prop="ip" width="150"/>
      <el-table-column label="最后登录时间" align="center" prop="loginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.roleId !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['user:account:client:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['user:account:client:remove']"
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

    <!-- 添加或修改客户端配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="账号ID" prop="accountId">
          <el-input v-model="form.accountId" placeholder="请输入账号ID"/>
        </el-form-item>
        <el-form-item label="客户端ID" prop="clientId">
          <el-input v-model="form.clientId" placeholder="请输入客户端ID"/>
        </el-form-item>
        <el-form-item label="推送注册ID" prop="pushRegId">
          <el-input v-model="form.pushRegId" placeholder="请输入推送注册ID"/>
        </el-form-item>
        <el-form-item label="客户端类型" prop="clientType">
          <el-input v-model="form.clientType" placeholder="请输入客户端类型"/>
        </el-form-item>
        <el-form-item label="最后登录IP" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入最后登录IP"/>
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
  listClient,
  getClient,
  addClient,
  updateClient,
  delClient
} from "@/api/customer/account/client";

export default {
  name: "Client",
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
      clientList: [],
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
    /** 查询客户端列表 */
    getList() {
      this.loading = true;
      listClient(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.clientList = response.rows;
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
        pushRegId: undefined,
        clientType: undefined
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
      this.title = "添加客户端";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const clientId = row.id || this.ids
      getClient(clientId).then(response => {
        this.form = response.data;
        this.open = true;
      });
      this.title = "修改客户端";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateClient(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addClient(this.form).then(response => {
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
      const clientIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除客户端编号为"' + clientIds + '"的数据项？').then(function () {
        return delClient(clientIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('tsp-account/mpt/client/export', {
        ...this.queryParams
      }, `client_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
