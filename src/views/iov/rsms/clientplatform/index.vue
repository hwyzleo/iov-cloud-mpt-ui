<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="唯一识别码" prop="uniqueCode">
        <el-input
          v-model="queryParams.uniqueCode"
          placeholder="请输入唯一识别码"
          clearable
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务端平台" prop="serverPlatformCode">
        <el-select
          v-model="queryParams.serverPlatformCode"
          placeholder="服务端平台"
          clearable
          style="width: 140px"
        >
          <el-option
            v-for="serverPlatform in this.serverPlatformList"
            :key="serverPlatform.code"
            :label="serverPlatform.name"
            :value="serverPlatform.code"
          />
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
          v-hasPermi="['iov:rsms:clientPlatform:add']"
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
          v-hasPermi="['iov:rsms:clientPlatform:edit']"
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
          v-hasPermi="['iov:rsms:clientPlatform:remove']"
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
          v-hasPermi="['iov:rsms:clientPlatform:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="clientPlatformList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="服务端平台" prop="serverPlatformCode" width="150">
        <template slot-scope="scope">
          <span>{{ getServerPlatformName(scope.row.serverPlatformCode) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="唯一识别码" prop="uniqueCode" width="120"/>
      <el-table-column label="用户名" prop="username" width="100"/>
      <el-table-column label="绑定主机名" prop="hostname"/>
      <el-table-column label="是否启用" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :active-value="true"
            :inactive-value="false"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="连接状态" align="center" prop="connectStat" width="150"/>
      <el-table-column label="登录状态" align="center" prop="loginStat" width="150"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['iov:rsms:clientPlatform:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['iov:rsms:clientPlatform:remove']"
          >删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-info"
            @click="handleNode(scope.row)"
            v-hasPermi="['iov:rsms:clientPlatform:listNode']"
          >节点管理
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

    <!-- 添加或修改客户端平台对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="服务端平台" prop="serverPlatformCode">
          <el-select
            v-model="form.serverPlatformCode"
            placeholder="服务端平台"
            clearable
          >
            <el-option
              v-for="serverPlatform in this.serverPlatformList"
              :key="serverPlatform.code"
              :label="serverPlatform.name"
              :value="serverPlatform.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="唯一识别码" prop="uniqueCode">
          <el-input v-model="form.uniqueCode" :readonly="form.id !== undefined" placeholder="请输入唯一识别码"/>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item label="绑定主机名" prop="hostname">
          <el-input v-model="form.hostname" placeholder="请输入绑定主机名"/>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio-group v-model="form.enable">
            <el-radio
              :label="true"
            >启用
            </el-radio>
            <el-radio
              :label="false"
            >停用
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 客户端平台节点 -->
    <el-drawer title="节点列表" :visible.sync="openNode" direction="rtl" size="30%" :modal="true"
               :append-to-body="true" :before-close="closeNode">
      <div class="drawer-content">
        <el-table :data="clientPlatformNodeList">
          <el-table-column label="节点主机名" prop="hostname"/>
          <el-table-column label="是否连接" align="center" width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.connect"
                :active-value="true"
                :inactive-value="false"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="是否登录" align="center" width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.login"
                :active-value="true"
                :inactive-value="false"
                @change="handleLoginChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeNode">关 闭</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  addClientPlatform,
  delClientPlatform,
  getClientPlatform,
  listClientPlatform,
  login,
  logout,
  updateClientPlatform
} from "@/api/iov/rsms/clientplatform";
import {listAllServerPlatform} from "@/api/iov/rsms/serverplatform";

export default {
  name: "ClientPlatform",
  dicts: [],
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
      // 客户端平台表格数据
      clientPlatformList: [],
      clientPlatformNodeList: [],
      // 服务端平台表格数据
      serverPlatformList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openNode: false,
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
        serverPlatformCode: [
          {required: true, message: "服务端平台不能为空", trigger: "blur"}
        ],
        uniqueCode: [
          {required: true, message: "唯一识别码不能为空", trigger: "blur"}
        ],
        username: [
          {required: true, message: "用户名不能为空", trigger: "blur"}
        ],
        password: [
          {required: true, message: "密码不能为空", trigger: "blur"}
        ]
      },
    };
  },
  created() {
    this.getAllServerPlatform();
    this.getList();
  },
  methods: {
    /** 查询客户端平台列表 */
    getList() {
      this.loading = true;
      listClientPlatform(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.clientPlatformList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 获取所有服务端平台列表 */
    getAllServerPlatform() {
      this.loading = true;
      listAllServerPlatform().then(response => {
          this.serverPlatformList = response;
          this.loading = false;
        }
      );
    },
    /** 获取服务端平台名称 */
    getServerPlatformName(serverPlatformCode) {
      const item = this.serverPlatformList.find(
        serverPlatform => serverPlatform.code === serverPlatformCode
      )
      return item ? item.name : serverPlatformCode
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 关闭节点列表按钮 */
    closeNode() {
      this.openNode = false;
      this.getList();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        serverPlatformCode: undefined,
        uniqueCode: undefined,
        description: undefined
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
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加客户端平台";
      this.form = {
        enable: true
      };
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const clientPlatformId = row.id || this.ids
      getClientPlatform(clientPlatformId).then(response => {
        this.form = response.data;
        this.open = true;
      });
      this.title = "修改客户端平台";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateClientPlatform(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addClientPlatform(this.form).then(response => {
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
      const clientPlatformIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除客户端平台ID为"' + clientPlatformIds + '"的数据项？').then(function () {
        return delClientPlatform(clientPlatformIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 节点管理按钮操作 */
    handleNode(row) {
      this.clientPlatformNodeList = [];
      Object.entries(row.connectState).forEach(([key, value]) => {
        this.clientPlatformNodeList.push({"id": row.id, "hostname": key, "connect": value, "login": row.loginState[key]})
      });
      this.openNode = true;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('tsp-rsms/mpt/clientPlatform/export', {
        ...this.queryParams
      }, `client_platform_${new Date().getTime()}.xlsx`)
    },
    /** 切换登录状态 */
    handleLoginChange(row) {
      let text = row.login ? "登入" : "登出";
      this.$modal.confirm('确认要"' + text + '"当前平台吗？').then(function () {
        if (row.login) {
          return login(row.id, row.hostname);
        } else {
          return logout(row.id, row.hostname);
        }
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.login = !row.login;
      });
    }
  }
};
</script>
