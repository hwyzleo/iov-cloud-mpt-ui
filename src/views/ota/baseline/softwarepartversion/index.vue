<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="软件零件号" prop="softwarePn">
        <el-input
          v-model="queryParams.softwarePn"
          placeholder="请输入软件零件号"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ECU" prop="ecuCode">
        <el-select
          v-model="queryParams.ecuCode"
          placeholder="ECU"
          clearable
          style="width: 140px"
        >
          <el-option
            v-for="ecu in this.ecuList"
            :key="ecu.code"
            :label="ecu.code + '(' + ecu.label + ')'"
            :value="ecu.code"
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
          v-hasPermi="['ota:baseline:softwarePartVersion:add']"
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
          v-hasPermi="['ota:baseline:softwarePartVersion:edit']"
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
          v-hasPermi="['ota:baseline:softwarePartVersion:remove']"
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
          v-hasPermi="['ota:baseline:softwarePartVersion:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="softwarePartVersionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="ECU" prop="ecuCode" width="100"/>
      <el-table-column label="软件零件号" prop="softwarePn"/>
      <el-table-column label="软件零件版本" prop="softwarePartVer" width="120"/>
      <el-table-column label="测试报告" prop="softwareReport" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.softwareReport && scope.row.softwareReport.trim() ? '已上传' : '未上传' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="软件来源" prop="softwareSource" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.softwareSource===1 ? 'BOM' : 'OTA' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="适配的总成硬件零件号" prop="adaptedHardwarePn" width="150"/>
      <el-table-column label="适配的总成软件零件号" prop="adaptedSoftwarePn" width="150"/>
      <el-table-column label="发布日期" align="center" prop="createTime" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.publishDate, '{y}-{m}-{d}') }}</span>
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
            v-hasPermi="['ota:baseline:softwarePartVersion:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ota:baseline:softwarePartVersion:remove']"
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

    <!-- 添加或修改软件零件版本信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="ECU" prop="ecuCode">
          <el-select
            v-model="form.ecuCode"
            placeholder="ECU"
            clearable
            @change="handleEcuChange"
          >
            <el-option
              v-for="ecu in this.ecuList"
              :key="ecu.code"
              :label="ecu.code + '(' + ecu.label + ')'"
              :value="ecu.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="软件零件号" prop="softwarePn">
          <el-autocomplete
            v-model="form.softwarePn"
            :fetch-suggestions="querySoftwarePart"
            placeholder="请输入软件零件号"
            :readonly="form.id !== undefined"
            :trigger-on-focus="false"
            @select="handleSoftwarePartSelect"
          >
            <template slot-suggestions="props">
              <li v-for="item in props.suggestions" :key="item.softwarePn" class="el-autocomplete-suggestion__item">
                <span>{{ item.softwarePn }} - {{ item.softwarePartName }}</span>
              </li>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="软件零件版本" prop="softwarePartVer">
          <el-input v-model="form.softwarePartVer" placeholder="请输入软件零件版本"/>
        </el-form-item>
        <el-form-item label="软件测试报告" prop="softwareReport">
          <el-input v-model="form.softwareReport" placeholder="请输入软件测试报告"/>
        </el-form-item>
        <el-form-item label="软件说明" prop="softwareDesc">
          <el-input v-model="form.softwareDesc" type="textarea" placeholder="请输入软件说明"/>
        </el-form-item>
        <el-form-item label="软件来源" prop="softwareSource">
          <el-select
            v-model="form.softwareSource"
            placeholder="软件来源"
            clearable
          >
            <el-option key="1" label="BOM" value="1" />
            <el-option key="2" label="OTA" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="适配的总成硬件零件号" prop="adaptedHardwarePn">
          <el-input v-model="form.adaptedHardwarePn" placeholder="请输入适配的总成硬件零件号"/>
        </el-form-item>
        <el-form-item label="适配的总成软件零件号" prop="adaptedSoftwarePn">
          <el-input v-model="form.adaptedSoftwarePn" placeholder="请输入适配的总成软件零件号"/>
        </el-form-item>
        <el-form-item label="发布时间" prop="publishDate">
          <el-date-picker
            v-model="form.publishDate"
            type="date"
            placeholder="请选择发布时间"
            value-format="timestamp"
          >
          </el-date-picker>
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
  listSoftwarePartVersion,
  getSoftwarePartVersion,
  addSoftwarePartVersion,
  updateSoftwarePartVersion,
  delSoftwarePartVersion
} from "@/api/ota/baseline/softwarepartversion";
import {
  listAllEcu,
} from "@/api/ota/baseline/ecu";
import {
  listAllSoftwarePart
} from "@/api/ota/baseline/softwarepart";

export default {
  name: "SoftwarePartVersion",
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
      softwarePartVersionList: [],
      softwarePartList: [],
      ecuList: [],
      selectEcu: "",
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
        ecuCode: [
          {required: true, message: "ECU不能为空", trigger: "blur"}
        ],
        softwarePn: [
          {required: true, message: "软件零件号不能为空", trigger: "blur"}
        ],
        softwarePartVer: [
          {required: true, message: "软件零件版本不能为空", trigger: "blur"}
        ],
        softwareSource: [
          {required: true, message: "软件来源不能为空", trigger: "blur"}
        ],
        adaptedHardwarePn: [
          {required: true, message: "适配的总成硬件零件号不能为空", trigger: "blur"}
        ],
        publishDate: [
          {required: true, message: "发布日期不能为空", trigger: "blur"}
        ]
      },
    };
  },
  created() {
    this.getEcuList();
    this.getList();
  },
  methods: {
    /** 查询软件零件版本列表 */
    getList() {
      this.loading = true;
      listSoftwarePartVersion(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.softwarePartVersionList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    getEcuList() {
      listAllEcu().then(response => {
          this.ecuList = response.data;
        }
      );
    },
    querySoftwarePart(queryString, cb) {
      if (!this.selectEcu || !queryString) {
        cb([]);
        return;
      }
      listAllSoftwarePart({
        ecuCode: this.selectEcu,
        softwarePn: queryString
      }).then(response => {
        if (response.data && response.data.length > 0) {
          const suggestions = response.data.map(item => {
            return {
              value: item.softwarePn,
              ...item
            };
          });
          cb(suggestions);
        } else {
          cb([]);
        }
      }).catch(() => {
        cb([]);
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        ecuCode: undefined,
        softwarePn: undefined,
        softwarePartVer: undefined,
        softwareReport: undefined,
        softwareDesc: undefined,
        softwareSource: undefined,
        adaptedHardwarePn: undefined,
        adaptedSoftwarePn: undefined,
        publishDate: undefined
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
      this.title = "添加软件零件版本信息";
      this.form = {
      };
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const softwarePartVersionId = row.id || this.ids
      getSoftwarePartVersion(softwarePartVersionId).then(response => {
        this.form = response.data;
        this.open = true;
      });
      this.title = "修改软件零件版本信息";
    },
    handleEcuChange(value) {
      if (value) {
        this.selectEcu = value;
      } else {
        this.selectEcu = '';
      }
    },
    handleSoftwarePartSelect(item) {
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateSoftwarePartVersion(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSoftwarePartVersion(this.form).then(response => {
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
      const softwarePartVersionIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除软件零件版本ID为"' + softwarePartVersionIds + '"的数据项？').then(function () {
        return delSoftwarePartVersion(softwarePartVersionIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ota-baseline/softwarePartVersion/export', {
        ...this.queryParams
      }, `software_part_version_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
