<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="平台代码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入平台代码"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="平台名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入平台名称"
          clearable
          style="width: 200px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="平台类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="平台类型"
          clearable
          style="width: 140px"
        >
          <el-option
            v-for="dict in dict.type.iov_rsms_server_platform_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
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
          v-hasPermi="['iov:rsms:serverPlatform:add']"
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
          v-hasPermi="['iov:rsms:serverPlatform:edit']"
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
          v-hasPermi="['iov:rsms:serverPlatform:remove']"
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
          v-hasPermi="['iov:rsms:serverPlatform:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="serverPlatformList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="平台代码" prop="code" width="80"/>
      <el-table-column label="平台名称" prop="name" width="100"/>
      <el-table-column label="平台类型" prop="type" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ getServerPlatformType(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台地址" prop="url"/>
      <el-table-column label="平台端口" prop="port" width="80"/>
      <el-table-column label="平台协议" prop="protocol" width="80"/>
      <el-table-column label="采集频率" prop="collectFrequency" width="80"/>
      <el-table-column label="上报频率" prop="reportFrequency" width="80"/>
      <el-table-column label="是否读写同步" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.readWriteSync"
            :active-value="true"
            :inactive-value="false"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="是否维持心跳" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.heartbeat"
            :active-value="true"
            :inactive-value="false"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="数据加密方式" prop="encryptType" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ getDataEncryptType(scope.row.encryptType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['iov:rsms:serverPlatform:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['iov:rsms:serverPlatform:remove']"
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

    <!-- 添加或修改服务端平台对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="平台代码" prop="code">
              <el-input v-model="form.code" :readonly="form.id !== undefined" placeholder="请输入平台代码"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台协议" prop="protocol">
              <el-input v-model="form.protocol" placeholder="请输入平台协议"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="平台类型" prop="type">
              <el-select
                v-model="form.type"
                placeholder="平台类型"
                clearable
              >
                <el-option
                  v-for="dict in dict.type.iov_rsms_server_platform_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入平台名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="平台地址" prop="url">
              <el-input v-model="form.url" placeholder="请输入平台地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台端口" prop="port">
              <el-input-number v-model="form.port" controls-position="right" :min="1"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="采集频率" prop="collectFrequency">
              <el-input-number v-model="form.collectFrequency" controls-position="right" :min="1"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报频率" prop="reportFrequency">
              <el-input-number v-model="form.reportFrequency" controls-position="right" :min="1"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否读写同步">
              <el-radio-group v-model="form.readWriteSync">
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否维持心跳">
              <el-radio-group v-model="form.heartbeat">
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据加密方式" prop="encryptType">
              <el-select
                v-model="form.encryptType"
                placeholder="数据加密方式"
                clearable
              >
                <el-option
                  v-for="dict in dict.type.iov_rsms_data_encrypt_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据加密KEY" prop="encryptKey">
              <el-input v-model="form.encryptKey" placeholder="请输入数据加密KEY"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容"></el-input>
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
  listServerPlatform,
  getServerPlatform,
  addServerPlatform,
  updateServerPlatform,
  delServerPlatform
} from "@/api/iov/rsms/serverplatform";

export default {
  name: "ServerPlatform",
  dicts: ['iov_rsms_server_platform_type','iov_rsms_data_encrypt_type'],
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
      // 服务端平台表格数据
      serverPlatformList: [],
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
        code: [
          {required: true, message: "平台代码不能为空", trigger: "blur"}
        ],
        name: [
          {required: true, message: "平台名称不能为空", trigger: "blur"}
        ],
        type: [
          {required: true, message: "平台类型不能为空", trigger: "blur"}
        ],
        url: [
          {required: true, message: "平台地址不能为空", trigger: "blur"}
        ],
        port: [
          {required: true, message: "平台端口不能为空", trigger: "blur"}
        ],
        protocol: [
          {required: true, message: "平台协议不能为空", trigger: "blur"}
        ],
        collectFrequency: [
          {required: true, message: "采集频率不能为空", trigger: "blur"}
        ],
        reportFrequency: [
          {required: true, message: "上报频率不能为空", trigger: "blur"}
        ],
        encryptType: [
          {required: true, message: "数据加密方式不能为空", trigger: "blur"}
        ]
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询基础车型列表 */
    getList() {
      this.loading = true;
      listServerPlatform(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.serverPlatformList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 获取平台类型 */
    getServerPlatformType(serverPlatformType) {
      if (!this.dict || !this.dict.type || !this.dict.type.iov_rsms_server_platform_type) {
        return serverPlatformType;
      }
      const item = this.dict.type.iov_rsms_server_platform_type.find(
        dict => dict.value === serverPlatformType
      )
      return item ? item.label : serverPlatformType
    },
    /** 获取数据加密类型 */
    getDataEncryptType(dataEncryptType) {
      if (!this.dict || !this.dict.type || !this.dict.type.iov_rsms_data_encrypt_type) {
        return dataEncryptType;
      }
      const item = this.dict.type.iov_rsms_data_encrypt_type.find(
        dict => dict.value === dataEncryptType
      )
      return item ? item.label : dataEncryptType
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        code: undefined,
        name: undefined,
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
      this.title = "添加服务端平台";
      this.form = {
        port: 19006,
        collectFrequency: 1000,
        reportFrequency: 10000,
        readWriteSync: false,
        heartbeat: false
      };
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const serverPlatformId = row.id || this.ids
      getServerPlatform(serverPlatformId).then(response => {
        this.form = response.data;
        this.open = true;
      });
      this.title = "修改服务端平台";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateServerPlatform(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addServerPlatform(this.form).then(response => {
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
      const serverPlatformIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除服务端平台ID为"' + serverPlatformIds + '"的数据项？').then(function () {
        return delServerPlatform(serverPlatformIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('tsp-rsms/mpt/serverPlatform/export', {
        ...this.queryParams
      }, `server_platform_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
