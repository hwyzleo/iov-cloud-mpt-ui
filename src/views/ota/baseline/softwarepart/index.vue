<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="软件零件号" prop="softwareNo">
        <el-input
          v-model="queryParams.softwarePn"
          placeholder="请输入软件零件号"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备" prop="deviceCode">
        <el-select
          v-model="queryParams.deviceCode"
          placeholder="设备"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="device in this.deviceList"
            :key="device.code"
            :label="device.code + '(' + device.label + ')'"
            :value="device.code"
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
          v-hasPermi="['ota:baseline:softwarePart:add']"
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
          v-hasPermi="['ota:baseline:softwarePart:edit']"
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
          v-hasPermi="['ota:baseline:softwarePart:remove']"
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
          v-hasPermi="['ota:baseline:softwarePart:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="softwarePartList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="设备" prop="deviceCode" width="100"/>
      <el-table-column label="软件零件号" prop="softwarePn"/>
      <el-table-column label="软件零件版本范围" prop="softwarePartVerRange"/>
      <el-table-column label="是否支持OTA" prop="ota" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ota ? '支持' : '不支持' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分区类型" prop="partitionType" width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.partitionType === 1">AB分区</span>
          <span v-else-if="scope.row.partitionType === 2">单分区</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有解闭锁安全件" prop="lockUnlockSecurityComponent" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lockUnlockSecurityComponent ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['ota:baseline:softwarePart:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ota:baseline:softwarePart:remove']"
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

    <!-- 添加或修改软件零件信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="设备" prop="deviceCode">
          <el-select
            v-model="form.deviceCode"
            placeholder="设备"
            clearable
            @change="handleDeviceChange"
            style="width: 100%"
          >
            <el-option
              v-for="device in this.deviceList"
              :key="device.code"
              :label="device.code + '(' + device.label + ')'"
              :value="device.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="软件零件号" prop="softwarePn">
          <el-input v-model="form.softwarePn" :readonly="form.id !== undefined" placeholder="请输入软件零件号"/>
        </el-form-item>
        <el-form-item label="软件零件名称" prop="softwarePartName">
          <el-input v-model="form.softwarePartName" placeholder="请输入软件零件名称"/>
        </el-form-item>
        <el-form-item label="软件零件版本范围" prop="softwarePartVerRange">
          <el-input v-model="form.softwarePartVerRange" type="textarea" placeholder="请输入软件零件版本范围"/>
        </el-form-item>
        <el-form-item label="是否支持OTA">
          <el-radio-group v-model="form.ota">
            <el-radio
              :label="true"
            >支持
            </el-radio>
            <el-radio
              :label="false"
            >不支持
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分区类型" prop="partitionType">
          <el-select
            v-model="form.partitionType"
            placeholder="分区类型"
            clearable
          >
            <el-option key="1" label="AB分区" value="1"/>
            <el-option key="2" label="单分区" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有解闭锁安全件">
          <el-radio-group v-model="form.lockUnlockSecurityComponent">
            <el-radio
              :label="true"
            >是
            </el-radio>
            <el-radio
              :label="false"
            >否
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
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
  listSoftwarePart,
  getSoftwarePart,
  addSoftwarePart,
  updateSoftwarePart,
  delSoftwarePart
} from "@/api/ota/baseline/softwarepart";
import {
  listAllDevice,
} from "@/api/completevehicle/vehicle/device";

export default {
  name: "SoftwarePart",
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
      // 软件零件表格数据
      softwarePartList: [],
      deviceList: [],
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
        deviceCode: [
          {required: true, message: "设备不能为空", trigger: "blur"}
        ],
        softwarePn: [
          {required: true, message: "软件零件号不能为空", trigger: "blur"}
        ],
        softwarePartVerRange: [
          {required: true, message: "软件零件版本范围不能为空", trigger: "blur"}
        ]
      },
    };
  },
  created() {
    this.getDeviceList();
    this.getList();
  },
  methods: {
    /** 查询软件零件列表 */
    getList() {
      this.loading = true;
      listSoftwarePart(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.softwarePartList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    getDeviceList() {
      listAllDevice().then(response => {
          this.deviceList = response.data;
        }
      );
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        deviceCode: undefined,
        softwarePartName: undefined,
        softwarePn: undefined,
        softwarePartVerRange: undefined,
        ota: undefined
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
      this.title = "添加软件零件信息";
      this.form = {
        ota: true,
        lockUnlockSecurityComponent: false
      };
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const softwarePartId = row.id || this.ids
      getSoftwarePart(softwarePartId).then(response => {
        this.form = response.data;
        this.open = true;
      });
      this.title = "修改软件零件信息";
    },
    handleDeviceChange(value) {
      if (value) {
        const selectedDevice = this.deviceList.find(device => device.code === value);
        if (selectedDevice) {
          this.form.softwarePartName = selectedDevice.label;
        }
      } else {
        this.form.softwarePartName = '';
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateSoftwarePart(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSoftwarePart(this.form).then(response => {
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
      const softwarePartIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除软件零件ID为"' + softwarePartIds + '"的数据项？').then(function () {
        return delSoftwarePart(softwarePartIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ota-baseline/softwarePart/export', {
        ...this.queryParams
      }, `software_part_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
