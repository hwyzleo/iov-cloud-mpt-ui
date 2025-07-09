<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="车架号" prop="vin">
        <el-input
          v-model="queryParams.vin"
          placeholder="请输入车架号"
          clearable
          style="width: 200px"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['iov:rsms:vehicleGbMessage:add']"
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
          v-hasPermi="['iov:rsms:vehicleGbMessage:edit']"
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
          v-hasPermi="['iov:rsms:vehicleGbMessage:remove']"
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
          v-hasPermi="['iov:rsms:vehicleGbMessage:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="vehicleGbMessageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="车架号" prop="vin" width="180"/>
      <el-table-column label="解析时间" align="center" prop="parseTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.parseTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消息时间" align="center" prop="messageTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.messageTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="命令标识" prop="commandFlag" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ getCommandFlagType(scope.row.commandFlag) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消息数据">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top" :content="scope.row.messageData" popper-class="my-tooltip">
            <div class="message-cell">
              {{ scope.row.messageData }}
            </div>
          </el-tooltip>
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
            @click="handleParse(scope.row)"
            v-hasPermi="['iov:rsms:vehicleGbMessage:query']"
          >解析
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['iov:rsms:vehicleGbMessage:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['iov:rsms:vehicleGbMessage:remove']"
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

    <!-- 添加或修改国标消息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车架号" prop="vin">
              <el-input v-model="form.vin" :readonly="form.id !== undefined" placeholder="请输入车架号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="命令标识" prop="commandFlag">
              <el-select
                v-model="form.commandFlag"
                placeholder="命令标识"
                clearable
              >
                <el-option
                  v-for="dict in dict.type.iov_rsms_command_flag_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="解析时间" prop="parseTime">
              <el-date-picker
                v-model="form.parseTime"
                type="datetime"
                placeholder="请选择解析时间"
                value-format="timestamp"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消息时间" prop="messageTime">
              <el-date-picker
                v-model="form.messageTime"
                type="datetime"
                placeholder="请选择消息时间"
                value-format="timestamp"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="消息数据" prop="messageData">
          <el-input v-model="form.messageData" type="textarea" placeholder="请输入消息数据"></el-input>
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

    <!-- 国标消息解析层 -->
    <el-drawer title="国标消息详细信息" :visible.sync="openParse" direction="rtl" size="80%" :modal="true" :append-to-body="true">
      <div class="drawer-content">
        <el-row>
          <el-col :span="3">消息数据</el-col>
          <el-col :span="21" style="word-break: break-word">{{form.messageData}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">消息时间</el-col>
          <el-col :span="21" style="word-break: break-word">{{ parseTime(form.messageTime) }}</el-col>
        </el-row>
        <el-row v-show="formParse?.data?.VEHICLE">整车数据</el-row>
        <el-row v-show="formParse?.data?.VEHICLE">
          <el-col :span="6">车辆状态: {{formParse?.data?.VEHICLE?.vehicleState}}</el-col>
          <el-col :span="6">充电状态: {{formParse?.data?.VEHICLE?.chargingState}}</el-col>
          <el-col :span="6">运行模式: {{formParse?.data?.VEHICLE?.runningMode}}</el-col>
          <el-col :span="6">车速: {{formParse?.data?.VEHICLE?.speed}} km/h</el-col>
        </el-row>
        <el-row v-show="formParse?.data?.VEHICLE">
          <el-col :span="6">累计里程: {{formParse?.data?.VEHICLE?.totalOdometer}} km</el-col>
          <el-col :span="6">总电压: {{formParse?.data?.VEHICLE?.totalVoltage}} V</el-col>
          <el-col :span="6">总电流: {{formParse?.data?.VEHICLE?.totalCurrent}} A</el-col>
          <el-col :span="6">SOC: {{formParse?.data?.VEHICLE?.soc}} %</el-col>
        </el-row>
        <el-row v-show="formParse?.data?.VEHICLE">
          <el-col :span="6">DC/DC状态: {{formParse?.data?.VEHICLE?.dcdcState}}</el-col>
          <el-col :span="6">驱动力: {{formParse?.data?.VEHICLE?.driving}}</el-col>
          <el-col :span="6">制动力: {{formParse?.data?.VEHICLE?.braking}}</el-col>
          <el-col :span="6">挡位: {{formParse?.data?.VEHICLE?.gear}}</el-col>
        </el-row>
        <el-row v-show="formParse?.data?.VEHICLE">
          <el-col :span="6">绝缘电阻: {{formParse?.data?.VEHICLE?.insulationResistance}} kΩ</el-col>
          <el-col :span="6">加速踏板行程值: {{formParse?.data?.VEHICLE?.acceleratorPedalPosition}} %</el-col>
          <el-col :span="6">制动踏板状态: {{formParse?.data?.VEHICLE?.brakePedalPosition}} %</el-col>
          <el-col :span="6"></el-col>
        </el-row>
        <div>驱动电机数据</div>
        <div>燃料电池数据</div>
        <div>发动机数据</div>
        <div>车辆位置</div>
        <div>极值数据</div>
        <div>报警数据</div>
        <div>可充电储能装置电压数据</div>
        <div>可充电储能装置温度数据</div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeParse">关 闭</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  addVehicleGbMessage,
  delVehicleGbMessage,
  getVehicleGbMessage,
  parseVehicleGbMessage,
  listVehicleGbMessage,
  updateVehicleGbMessage
} from "@/api/iov/rsms/vehiclegbmessage";

export default {
  name: "VehicleGbMessage",
  dicts: ['iov_rsms_command_flag_type'],
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
      // 车辆国标消息表格数据
      vehicleGbMessageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示解析层
      openParse: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      // 解析表单参数
      formParse: {},
      // 表单校验
      rules: {
        vin: [
          {required: true, message: "车架号不能为空", trigger: "blur"}
        ],
        commandFlag: [
          {required: true, message: "命令标识不能为空", trigger: "blur"}
        ],
        parseTime: [
          {required: true, message: "解析时间不能为空", trigger: "blur"}
        ],
        messageTime: [
          {required: true, message: "消息时间不能为空", trigger: "blur"}
        ],
        messageData: [
          {required: true, message: "消息数据不能为空", trigger: "blur"}
        ]
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询车辆国标消息列表 */
    getList() {
      this.loading = true;
      listVehicleGbMessage(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.vehicleGbMessageList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 获取命令标识类型 */
    getCommandFlagType(commandFlag) {
      if (!this.dict || !this.dict.type || !this.dict.type.iov_rsms_command_flag_type) {
        return commandFlag;
      }
      const item = this.dict.type.iov_rsms_command_flag_type.find(
        dict => dict.value === commandFlag
      )
      return item ? item.label : commandFlag
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 关闭解析按钮 */
    closeParse() {
      this.openParse = false;
    },
    /** 表单重置 */
    reset() {
      this.form = {
        vin: undefined,
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
      this.title = "添加车辆国标消息";
      this.form = {};
    },
    /** 解析按钮操作 */
    handleParse(row) {
      this.reset();
      const vehicleGbMessageId = row.id || this.ids
      this.form = row;
        parseVehicleGbMessage(vehicleGbMessageId).then(response => {
        this.formParse = response.data;
        this.openParse = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const vehicleGbMessageId = row.id || this.ids
      getVehicleGbMessage(vehicleGbMessageId).then(response => {
        this.form = response.data;
        this.open = true;
      });
      this.title = "修改车辆国标消息";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateVehicleGbMessage(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addVehicleGbMessage(this.form).then(response => {
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
      const vehicleGbMessageIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除车辆国标消息ID为"' + vehicleGbMessageIds + '"的数据项？').then(function () {
        return delVehicleGbMessage(vehicleGbMessageIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('tsp-rsms/mpt/vehicleGbMessage/export', {
        ...this.queryParams
      }, `vehicle_gb_message_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style>
.message-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.message-cell:hover {
  cursor: pointer;
}
.my-tooltip {
  max-width: 400px !important;
  white-space: normal !important;
  word-break: break-word !important;
}
.drawer-content {
  padding: 20px;
}
</style>
