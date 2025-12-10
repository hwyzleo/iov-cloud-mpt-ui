<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="活动名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入活动名称"
          clearable
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活动状态" prop="type">
        <el-select
          v-model="queryParams.state"
          placeholder="活动状态"
          clearable
          style="width: 140px"
        >
          <el-option
            v-for="activityState in this.activityStateList"
            :key="activityState.value"
            :label="activityState.label"
            :value="activityState.value"
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
          v-hasPermi="['ota:fota:activity:add']"
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
          v-hasPermi="['ota:fota:activity:edit']"
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
          v-hasPermi="['ota:fota:activity:remove']"
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
          v-hasPermi="['ota:fota:activity:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="activityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="活动名称" prop="name"/>
      <el-table-column label="活动版本" prop="version" width="120"/>
      <el-table-column label="活动开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动发布时间" align="center" prop="publishTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.publishTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动状态" prop="state" width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state === 1">待提交</span>
          <span v-else-if="scope.row.state === 2">待审核</span>
          <span v-else-if="scope.row.state === 3">已审核</span>
          <span v-else-if="scope.row.state === 4">未通过</span>
          <span v-else-if="scope.row.state === 5">已发布</span>
          <span v-else-if="scope.row.state === 6">已结束</span>
          <span v-else-if="scope.row.state === 7">已取消</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="是否基线活动" align="center" prop="baseline" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.baseline ? '是' : '否'  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本数" prop="softwarePartVersionCount" width="100" align="center"/>
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
            v-hasPermi="['ota:fota:activity:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleActivitySoftwarePartVersion(scope.row)"
            v-hasPermi="['ota:fota:activity:edit']"
          >关联版本
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ota:fota:activity:remove']"
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

    <!-- 添加或修改升级活动对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入活动名称"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动版本" prop="version">
              <el-input v-model="form.version" placeholder="请输入活动版本"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总文件大小(MB)" prop="totalFileSize">
              <el-input-number v-model="form.totalFileSize" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="升级须知" prop="upgradeNoticeArticleTitle">
          <div>
            <el-autocomplete
              v-model="form.upgradeNoticeArticleTitle"
              :fetch-suggestions="queryUpgradeNotice"
              placeholder="请查询升级须知"
              :trigger-on-focus="false"
              clearable
              @select="handleUpgradeNoticeSelect"
            >
              <template #default="{ item }">
                <div>{{ item.title }}</div>
              </template>
            </el-autocomplete>
          </div>
        </el-form-item>
        <el-form-item label="活动条款" prop="activityTermArticleTitle">
          <div>
            <el-autocomplete
              v-model="form.activityTermArticleTitle"
              :fetch-suggestions="queryActivityTerm"
              placeholder="请查询活动条款"
              :trigger-on-focus="false"
              clearable
              @select="handleActivityTermSelect"
            >
              <template #default="{ item }">
                <div>{{ item.title }}</div>
              </template>
            </el-autocomplete>
          </div>
        </el-form-item>
        <el-form-item label="隐私协议" prop="privacyAgreementArticleTitle">
          <div>
            <el-autocomplete
              v-model="form.privacyAgreementArticleTitle"
              :fetch-suggestions="queryPrivacyAgreement"
              placeholder="请查询隐私协议"
              :trigger-on-focus="false"
              clearable
              @select="handlePrivacyAgreementSelect"
            >
              <template #default="{ item }">
                <div>{{ item.title }}</div>
              </template>
            </el-autocomplete>
          </div>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动开始时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="请选择活动开始时间"
                value-format="timestamp"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="请选择活动结束时间"
                value-format="timestamp"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="升级目的">
          <el-input v-model="form.upgradePurpose" type="textarea" placeholder="请输入升级目的"></el-input>
        </el-form-item>
        <el-form-item label="升级功能项">
          <el-input v-model="form.upgradeFunction" type="textarea" placeholder="请输入升级功能项"></el-input>
        </el-form-item>
        <el-form-item label="活动说明">
          <el-input v-model="form.statement" type="textarea" placeholder="请输入活动说明"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否基线活动" prop="baseline">
              <el-radio-group v-model="form.baseline">
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="基线代码" prop="baselineCode">
              <el-input v-model="form.baselineCode" placeholder="请输入基线代码"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 升级活动关联软件零件版本信息层 -->
    <el-drawer title="关联软件零件版本信息" :visible.sync="openActivitySoftwarePartVersion" direction="rtl" size="80%"
               :modal="true"
               :append-to-body="true"
               @close="onActivitySoftwarePartVersionClose">
      <div class="drawer-content">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAddSoftwarePartVersion"
              v-hasPermi="['ota:fota:activity:edit']"
            >查询并添加软件零件版本
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getListActivitySoftwarePartVersion"></right-toolbar>
        </el-row>
        <el-table v-loading="loadingActivitySoftwarePartVersion" :data="activitySoftwarePartVersionList"
                  @selection-change="handleSelectionChangeActivitySoftwarePartVersion">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="ECU" prop="ecuCode" width="100"/>
          <el-table-column label="软件零件号" prop="softwarePn"/>
          <el-table-column label="软件零件名称" prop="softwarePartName"/>
          <el-table-column label="软件零件版本" prop="softwarePartVer" width="120"/>
          <el-table-column label="软件来源" prop="softwareSource" width="120" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.softwareSource === 1">BOM</span>
              <span v-else-if="scope.row.softwareSource === 2">OTA</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleRemoveActivitySoftwarePartVersion(scope.row)"
                v-hasPermi="['ota:fota:activity:edit']"
              >删除关联
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>

    <!-- 软件零件版本列表对话框 -->
    <el-dialog title="查询并添加软件零件版本" :visible.sync="openSoftwarePartVersion" width="900px" append-to-body>
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
            v-hasPermi="['ota:baseline:baseline:edit']"
          >关联
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getListSoftwarePartVersion"></right-toolbar>
      </el-row>

      <el-table ref="softwarePartVersionTable" v-loading="loadingSoftwarePartVersion" :data="softwarePartVersionList"
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
              @click="handleAddActivitySoftwarePartVersion(scope.row)"
              v-hasPermi="['ota:fota:activity:edit']"
            >关联
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
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="closeSoftwarePartVersion">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addActivity,
  addSoftwarePartVersion,
  delActivity,
  delSoftwarePartVersion,
  getActivity,
  listActivity,
  listAllActivityState,
  listActivitySoftwarePartVersion,
  updateActivity
} from "@/api/ota/fota/activity";
import {listArticle,} from "@/api/ota/fota/article";
import {listSoftwarePartVersion} from "@/api/ota/baseline/softwarepartversion";

export default {
  name: "Activity",
  dicts: [],
  data() {
    return {
      // 遮罩层
      loading: true,
      loadingActivitySoftwarePartVersion: true,
      loadingSoftwarePartVersion: true,
      // 选中数组
      ids: [],
      idsActivitySoftwarePartVersion: [],
      // 非单个禁用
      single: true,
      singleActivitySoftwarePartVersion: true,
      // 非多个禁用
      multiple: true,
      multipleActivitySoftwarePartVersion: true,
      // 显示搜索条件
      showSearch: true,
      showSearchSoftwarePartVersion: true,
      // 总条数
      total: 0,
      totalSoftwarePartVersion: 0,
      // 升级活动表格数据
      activityList: [],
      activityStateList: [],
      activitySoftwarePartVersionList: [],
      softwarePartVersionList: [],
      currentActivityId: undefined,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openActivitySoftwarePartVersion: false,
      openSoftwarePartVersion: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
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
        version: [
          {required: true, message: "活动版本不能为空", trigger: "blur"}
        ],
        name: [
          {required: true, message: "活动名称不能为空", trigger: "blur"}
        ],
        totalFileSize: [
          {required: true, message: "总文件大小不能为空", trigger: "blur"}
        ]
      },
    };
  },
  created() {
    this.getActivityStateList();
    this.getList();
  },
  methods: {
    /** 查询升级活动列表 */
    getList() {
      this.loading = true;
      listActivity(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.activityList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    getActivityStateList() {
      listAllActivityState().then(response => {
          this.activityStateList = response.data;
        }
      );
    },
    getListActivitySoftwarePartVersion() {
      this.loadingActivitySoftwarePartVersion = true;
      listActivitySoftwarePartVersion(this.currentActivityId).then(response => {
          this.activitySoftwarePartVersionList = response.data;
        }
      );
    },
    getListSoftwarePartVersion() {
      this.loadingSoftwarePartVersion = true;
      listSoftwarePartVersion(this.queryParamsSoftwarePartVersion).then(response => {
          this.softwarePartVersionList = response.rows;
          this.totalSoftwarePartVersion = response.total;
          this.loadingSoftwarePartVersion = false;
          this.$nextTick(() => {
            this.setDefaultSelection();
          });
        }
      );
    },
    queryUpgradeNotice(queryString, cb) {
      listArticle({
        title: queryString,
        type: 2
      }).then(response => {
        if (response.rows && response.rows.length > 0) {
          const suggestions = response.rows.map(item => {
            return {
              value: item.title,
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
    queryActivityTerm(queryString, cb) {
      listArticle({
        title: queryString,
        type: 1
      }).then(response => {
        if (response.rows && response.rows.length > 0) {
          const suggestions = response.rows.map(item => {
            return {
              value: item.title,
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
    queryPrivacyAgreement(queryString, cb) {
      listArticle({
        title: queryString,
        type: 3
      }).then(response => {
        if (response.rows && response.rows.length > 0) {
          const suggestions = response.rows.map(item => {
            return {
              value: item.title,
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
    closeSoftwarePartVersion() {
      this.openSoftwarePartVersion = false;
    },
    /** 表单重置 */
    reset() {
      this.form = {
        name: undefined,
        version: undefined,
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
    handleSelectionChangeActivitySoftwarePartVersion(selection) {
      this.idsActivitySoftwarePartVersion = selection.map(item => item.id)
      this.singleActivitySoftwarePartVersion = selection.length != 1
      this.multipleActivitySoftwarePartVersion = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加升级活动";
      this.form = {
        baseline: true
      };
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const activityId = row.id || this.ids
      getActivity(activityId).then(response => {
        this.form = response.data;
        this.open = true;
      });
      this.title = "修改升级活动";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateActivity(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addActivity(this.form).then(response => {
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
      const activityIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除升级活动ID为"' + activityIds + '"的数据项？').then(function () {
        return delActivity(activityIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ota-fota/activity/export', {
        ...this.queryParams
      }, `activity_${new Date().getTime()}.xlsx`)
    },
    handleUpgradeNoticeSelect(item) {
      this.form.upgradeNoticeArticleId = item.id;
    },
    handleActivityTermSelect(item) {
      this.form.activityTermArticleId = item.id;
    },
    handlePrivacyAgreementSelect(item) {
      this.form.privacyAgreementArticleId = item.id;
    },
    handleActivitySoftwarePartVersion(row) {
      this.currentActivityId = row.id;
      this.openActivitySoftwarePartVersion = true;
      this.getListActivitySoftwarePartVersion();
    },
    handleRemoveActivitySoftwarePartVersion(row) {
      const softwarePartVersionIds = row.id || this.idsBaselineSoftwarePartVersion;
      this.$modal.confirm('是否确认删除升级活动' + this.currentActivityId + '下关联软件零件版本ID为"' + softwarePartVersionIds + '"的数据项？').then(() => {
        return delSoftwarePartVersion(this.currentActivityId, softwarePartVersionIds);
      }).then(() => {
        this.$modal.msgSuccess("删除成功");
        this.getListActivitySoftwarePartVersion();
      }).catch(() => {
      });
    },
    handleAddSoftwarePartVersion() {
      this.openSoftwarePartVersion = true;
      this.getListSoftwarePartVersion();
    },
    handleQuerySoftwarePartVersion() {
      this.queryParamsSoftwarePartVersion.pageNum = 1;
      this.getListSoftwarePartVersion();
    },
    handleAddActivitySoftwarePartVersion(row) {
      const softwarePartVersionIds = row.id || this.idsSoftwarePartVersion;
      this.$modal.confirm('是否确认将软件零件版本ID为"' + softwarePartVersionIds + '"的数据项关联到升级活动ID' + this.currentBaselineId + '？').then(() => {
        return addSoftwarePartVersion(this.currentActivityId, softwarePartVersionIds);
      }).then(() => {
        this.$modal.msgSuccess("关联成功");
        this.closeSoftwarePartVersion();
        this.getListActivitySoftwarePartVersion();
      }).catch(() => {
      });
    },
    setDefaultSelection() {
      const linkedIds = this.activitySoftwarePartVersionList.map(item => item.id);
      const selectedRows = this.softwarePartVersionList.filter(item =>
        linkedIds.includes(item.id)
      );
      this.$refs.softwarePartVersionTable.clearSelection();
      this.$nextTick(() => {
        selectedRows.forEach(row => {
          this.$refs.softwarePartVersionTable.toggleRowSelection(row, true);
        });
      });
    },
    onActivitySoftwarePartVersionClose() {
      this.getList();
    },
  }
};
</script>
