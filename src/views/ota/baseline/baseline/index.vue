<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="基线代码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入基线代码"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="基线名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入基线名称"
          clearable
          style="width: 150px"
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
          v-hasPermi="['ota:baseline:baseline:add']"
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
          v-hasPermi="['ota:baseline:baseline:edit']"
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
          v-hasPermi="['ota:baseline:baseline:remove']"
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
          v-hasPermi="['ota:baseline:baseline:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="baselineList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="基线代码" prop="code" width="250"/>
      <el-table-column label="基线名称" prop="name"/>
      <el-table-column label="基线类型" prop="type" width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 'TEST'">测试基线</span>
          <span v-else-if="scope.row.type === 'RELEASE'">正式基线</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="基线来源" prop="source" width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.source === 1">BOM</span>
          <span v-else-if="scope.row.source === 2">OTA</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="车型编码" prop="vehModel" width="120" align="center"/>
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
            v-hasPermi="['ota:baseline:baseline:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleBaselineSoftwarePartVersion(scope.row)"
            v-hasPermi="['ota:baseline:baseline:query']"
          >关联
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ota:baseline:baseline:remove']"
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

    <!-- 添加或修改基线信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="基线代码" prop="code">
          <el-input v-model="form.code" :readonly="form.id !== undefined" placeholder="请输入基线代码"/>
        </el-form-item>
        <el-form-item label="基线名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入基线名称"/>
        </el-form-item>
        <el-form-item label="基线类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="基线类型"
            clearable
          >
            <el-option key="TEST" label="测试基线" value="TEST"/>
            <el-option key="RELEASE" label="正式基线" value="RELEASE"/>
          </el-select>
        </el-form-item>
        <el-form-item label="基线来源" prop="source">
          <el-select
            v-model="form.source"
            placeholder="基线来源"
            clearable
          >
            <el-option key="1" label="BOM" value="1"/>
            <el-option key="2" label="OTA" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="车型编码" prop="vehModel">
          <el-input v-model="form.vehModel" placeholder="请输入车型编码"/>
        </el-form-item>
        <el-form-item label="发布日期" prop="publishDate">
          <el-date-picker
            v-model="form.publishDate"
            type="date"
            placeholder="请选择发布日期"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="基线说明">
          <el-input v-model="form.baselineDesc" type="textarea" placeholder="请输入基线说明"></el-input>
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

    <!-- 基线关联软件零件版本信息层 -->
    <el-drawer title="关联软件零件版本信息" :visible.sync="openBaselineSoftwarePartVersion" direction="rtl" size="80%"
               :modal="true"
               :append-to-body="true">
      <div class="drawer-content">
        <el-form :model="queryParamsBaselineSoftwarePartVersion" ref="queryParamsBaselineSoftwarePartVersion"
                 size="small" :inline="true" v-show="showSearchBaselineSoftwarePartVersion">
          <el-form-item label="软件零件号" prop="softwarePn">
            <el-input
              v-model="queryParamsBaselineSoftwarePartVersion.softwarePn"
              placeholder="请输入软件零件号"
              clearable
              style="width: 140px"
              @keyup.enter.native="handleQueryBaselineSoftwarePartVersion"
            />
          </el-form-item>
          <el-form-item label="ECU" prop="ecuCode">
            <el-select
              v-model="queryParamsBaselineSoftwarePartVersion.ecuCode"
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
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryBaselineSoftwarePartVersion">
              搜索
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQueryBaselineSoftwarePartVersion">重置
            </el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAddSoftwarePartVersion"
              v-hasPermi="['ota:baseline:baseline:edit']"
            >查询并添加软件零件版本
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table v-loading="loadingBaselineSoftwarePartVersion" :data="baselineSoftwarePartVersionList"
                  @selection-change="handleSelectionChangeBaselineSoftwarePartVersion">
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
              <span>{{ scope.row.softwareSource === 1 ? 'BOM' : 'OTA' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="适配的总成硬件零件号" prop="adaptedHardwarePn" width="150"/>
          <el-table-column label="适配的总成软件零件号" prop="adaptedSoftwarePn" width="150"/>
          <el-table-column label="发布日期" align="center" prop="createTime" width="120">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.publishDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleRemoveBaselineSoftwarePartVersion(scope.row)"
                v-hasPermi="['ota:baseline:baseline:edit']"
              >删除关联
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="totalBaselineSoftwarePartVersion>0"
          :total="totalBaselineSoftwarePartVersion"
          :page.sync="queryParamsBaselineSoftwarePartVersion.pageNum"
          :limit.sync="queryParamsBaselineSoftwarePartVersion.pageSize"
          @pagination="getListBaselineSoftwarePartVersion"
        />
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeBaselineSoftwarePartVersion">关 闭</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 软件零件版本列表对话框 -->
    <el-dialog :title="title" :visible.sync="openSoftwarePartVersion" width="700px" append-to-body>
      <el-form :model="queryParamsSoftwarePartVersion" ref="queryFormSoftwarePartVersion" size="small" :inline="true"
               v-show="showSearchSoftwarePartVersion">
        <el-form-item label="软件零件号" prop="softwarePn">
          <el-input
            v-model="queryParamsSoftwarePartVersion.softwarePn"
            placeholder="请输入软件零件号"
            clearable
            style="width: 140px"
            @keyup.enter.native="handleQuerySoftwarePartVersion"
          />
        </el-form-item>
        <el-form-item label="ECU" prop="ecuCode">
          <el-select
            v-model="queryParamsSoftwarePartVersion.ecuCode"
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
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuerySoftwarePartVersion">搜索
          </el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuerySoftwarePartVersion">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            :disabled="multipleSoftwarePartVersion"
            @click="handleAddBaselineSoftwarePartVersion"
            v-hasPermi="['ota:baseline:softwarePartVersion:remove']"
          >关联
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getListSoftwarePartVersion"></right-toolbar>
      </el-row>

      <el-table v-loading="loadingSoftwarePartVersion" :data="softwarePartVersionList"
                @selection-change="handleSelectionChangeSoftwarePartVersion">
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
            <span>{{ scope.row.softwareSource === 1 ? 'BOM' : 'OTA' }}</span>
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
            >关联
            </el-button>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSoftwarePartVersion">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addBaseline,
  addSoftwarePartVersion,
  delBaseline,
  delBaselineSoftwarePartVersion,
  getBaseline,
  listBaseline,
  listBaselineSoftwarePartVersion,
  updateBaseline
} from "@/api/ota/baseline/baseline";
import {listAllEcu,} from "@/api/ota/baseline/ecu";
import {listSoftwarePartVersion,} from "@/api/ota/baseline/softwarepartversion";

export default {
  name: "Baseline",
  dicts: [],
  data() {
    return {
      // 遮罩层
      loading: true,
      loadingBaselineSoftwarePartVersion: true,
      loadingSoftwarePartVersion: true,
      // 选中数组
      ids: [],
      idsBaselineSoftwarePartVersion: [],
      idsSoftwarePartVersion: [],
      // 非单个禁用
      single: true,
      singleBaselineSoftwarePartVersion: true,
      singleSoftwarePartVersion: true,
      // 非多个禁用
      multiple: true,
      multipleBaselineSoftwarePartVersion: true,
      multipleSoftwarePartVersion: true,
      // 显示搜索条件
      showSearch: true,
      showSearchBaselineSoftwarePartVersion: true,
      showSearchSoftwarePartVersion: true,
      // 总条数
      total: 0,
      totalBaselineSoftwarePartVersion: 0,
      totalSoftwarePartVersion: 0,
      // 基线表格数据
      baselineList: [],
      baselineSoftwarePartVersionList: [],
      softwarePartVersionList: [],
      ecuList: [],
      currentBaselineId: undefined,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openBaselineSoftwarePartVersion: false,
      openSoftwarePartVersion: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      queryParamsBaselineSoftwarePartVersion: {
        pageNum: 1,
        pageSize: 10
      },
      queryParamsSoftwarePartVersion: {
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [
          {required: true, message: "基线代码不能为空", trigger: "blur"}
        ],
        name: [
          {required: true, message: "基线名称不能为空", trigger: "blur"}
        ]
      },
    };
  },
  created() {
    this.getEcuList();
    this.getList();
  },
  methods: {
    /** 查询基线列表 */
    getList() {
      this.loading = true;
      listBaseline(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.baselineList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    getListBaselineSoftwarePartVersion() {
      this.loadingBaselineSoftwarePartVersion = true;
      listBaselineSoftwarePartVersion(this.currentBaselineId, this.queryParamsBaselineSoftwarePartVersion).then(response => {
          this.baselineSoftwarePartVersionList = response.rows;
          this.totalBaselineSoftwarePartVersion = response.total;
          this.loadingBaselineSoftwarePartVersion = false;
        }
      );
    },
    getEcuList() {
      listAllEcu().then(response => {
          this.ecuList = response.data;
        }
      );
    },
    getListSoftwarePartVersion() {
      this.loadingSoftwarePartVersion = true;
      listSoftwarePartVersion(this.queryParamsSoftwarePartVersion).then(response => {
          this.softwarePartVersionList = response.rows;
          this.totalSoftwarePartVersion = response.total;
          this.loadingSoftwarePartVersion = false;
        }
      );
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    closeSoftwarePartVersion() {
      this.openSoftwarePartVersion = false;
    },
    closeBaselineSoftwarePartVersion() {
      this.openBaselineSoftwarePartVersion = false;
    },
    /** 表单重置 */
    reset() {
      this.form = {
        code: undefined,
        name: undefined,
        type: undefined,
        source: undefined,
        vehModel: undefined,
        publishDate: undefined,
        baselineDesc: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    handleQueryBaselineSoftwarePartVersion() {
      this.queryParamsBaselineSoftwarePartVersion.pageNum = 1;
      this.getListBaselineSoftwarePartVersion();
    },
    handleQuerySoftwarePartVersion() {
      this.queryParamsSoftwarePartVersion.pageNum = 1;
      this.getListSoftwarePartVersion();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    resetQueryBaselineSoftwarePartVersion() {
      this.resetForm("queryFormBaselineSoftwarePartVersion");
      this.handleQueryBaselineSoftwarePartVersion();
    },
    resetQuerySoftwarePartVersion() {
      this.resetForm("queryFormSoftwarePartVersion");
      this.handleQuerySoftwarePartVersion();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    handleSelectionChangeBaselineSoftwarePartVersion(selection) {
      this.idsBaselineSoftwarePartVersion = selection.map(item => item.id)
      this.singleBaselineSoftwarePartVersion = selection.length != 1
      this.multipleBaselineSoftwarePartVersion = !selection.length
    },
    handleSelectionChangeSoftwarePartVersion(selection) {
      this.idsSoftwarePartVersion = selection.map(item => item.id)
      this.singleSoftwarePartVersion = selection.length != 1
      this.multipleSoftwarePartVersion = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加基线";
      this.form = {};
    },
    handleAddSoftwarePartVersion() {
      this.openSoftwarePartVersion = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const baselineId = row.id || this.ids
      getBaseline(baselineId).then(response => {
        this.form = response.data;
        this.open = true;
      });
      this.title = "修改基线";
    },
    handleRemoveBaselineSoftwarePartVersion(row) {
      const baselineSoftwarePartVersionIds = row.id || this.idsBaselineSoftwarePartVersion;
      delBaselineSoftwarePartVersion(this.currentBaselineId, baselineSoftwarePartVersionIds).then(() => {
        this.getListBaselineSoftwarePartVersion();
      });
    },
    handleBaselineSoftwarePartVersion(row) {
      this.currentBaselineId = row.id;
      this.openBaselineSoftwarePartVersion = true;
      this.getListBaselineSoftwarePartVersion();
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateBaseline(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBaseline(this.form).then(response => {
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
      const baselineIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除基线ID为"' + baselineIds + '"的数据项？').then(function () {
        return delBaseline(baselineIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    handleAddBaselineSoftwarePartVersion(row) {
      const softwarePartVersionIds = row.id || this.idsSoftwarePartVersion;
      this.$modal.confirm('是否确认添加软件零件版本ID为"' + softwarePartVersionIds + '"的数据项？').then(function () {
        return addSoftwarePartVersion(this.currentBaselineId, softwarePartVersionIds);
      }).then(() => {
        this.$modal.msgSuccess("关联成功");
        this.closeSoftwarePartVersion();
        this.getListBaselineSoftwarePartVersion();
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ota-baseline/baseline/export', {
        ...this.queryParams
      }, `baseline_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
