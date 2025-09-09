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
      <el-table-column label="软件包数" prop="softwarePackageCount" width="100" align="center"/>
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
            icon="el-icon-edit"
            @click="handleSoftwarePartVersionPackage(scope.row)"
            v-hasPermi="['ota:baseline:baseline:query']"
          >关联
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
          <div style="display: flex; width: 100%;">
            <el-autocomplete
              v-model="form.softwarePn"
              :fetch-suggestions="querySoftwarePart"
              placeholder="请输入软件零件号"
              :disabled="form.ecuCode === undefined || form.ecuCode === ''"
              :readonly="softwarePnSelected"
              :trigger-on-focus="false"
              clearable
              @select="handleSoftwarePartSelect"
              @change="handleSoftwarePartChange"
              style="flex: 1; margin-right: 10px;"
            >
              <template #default="{ item }">
                <div>{{ item.softwarePn }} - {{ item.softwarePartName }}</div>
              </template>
            </el-autocomplete>
            <el-select
              :key="selectKey"
              v-model="form.softwarePartVer"
              placeholder="版本"
              :disabled="form.ecuCode === undefined || form.ecuCode === ''"
              clearable
              style="width: 80px;"
            >
              <el-option
                v-for="version in this.softwarePartVerRange"
                :key="version"
                :label="version"
                :value="version"
              />
            </el-select>
          </div>
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
            <el-option key="1" label="BOM" value="1"/>
            <el-option key="2" label="OTA" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="适配的总成硬件零件号" prop="adaptedHardwarePn">
          <el-input v-model="form.adaptedHardwarePn" placeholder="请输入适配的总成硬件零件号"/>
        </el-form-item>
        <el-form-item label="适配的总成软件零件号" prop="adaptedSoftwarePn">
          <el-input v-model="form.adaptedSoftwarePn" placeholder="请输入适配的总成软件零件号"/>
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
        <el-form-item label="备注">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 软件零件版本关联软件包信息层 -->
    <el-drawer title="关联软件包信息" :visible.sync="openSoftwarePartVersionPackage" direction="rtl" size="80%"
               :modal="true"
               :append-to-body="true"
               @close="onSoftwarePartVersionPackageClose">
      <div class="drawer-content">
        <el-form :model="queryParamsSoftwarePartVersionPackage" ref="queryParamsSoftwarePartVersionPackage"
                 size="small" :inline="true" v-show="showSearchSoftwarePartVersionPackage">
          <el-form-item label="软件包名称" prop="packageName">
            <el-input
              v-model="queryParamsSoftwarePartVersionPackage.packageName"
              placeholder="请输入软件包名称"
              clearable
              style="width: 140px"
              @keyup.enter.native="handleQuerySoftwarePartVersionPackage"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuerySoftwarePartVersionPackage">
              搜索
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuerySoftwarePartVersionPackage">重置
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
              @click="handleAddSoftwarePackage"
              v-hasPermi="['ota:baseline:baseline:edit']"
            >查询并添加软件包
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getListSoftwarePartVersionPackage"></right-toolbar>
        </el-row>
        <el-table v-loading="loadingSoftwarePartVersionPackage" :data="softwarePartVersionPackageList"
                  @selection-change="handleSelectionChangeSoftwarePartVersionPackage">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="软件包名称" prop="packageName"/>
          <el-table-column label="软件包类型" prop="packageType" width="100" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.packageType === 1 ? '全量' : '差分' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="软件包来源" prop="packageSource" width="100" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.packageSource === 1 ? 'BOM' : 'OTA' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="基础软件零件号" prop="baseSoftwarePn" width="150"/>
          <el-table-column label="基础软件版本" prop="baseSoftwareVer" width="150"/>
          <el-table-column label="适配级别" prop="packageAdaptionLevel" width="150" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.packageAdaptionLevel === 1">基础版本及以下</span>
              <span v-else-if="scope.row.packageAdaptionLevel === 2">基础版本及以上</span>
              <span v-else-if="scope.row.packageAdaptionLevel === 3">与基础版本一致</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column label="是否是OTA包" prop="ota" width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.ota ? '是' : '否' }}</span>
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
          v-show="totalSoftwarePartVersionPackage>0"
          :total="totalSoftwarePartVersionPackage"
          :page.sync="queryParamsSoftwarePartVersionPackage.pageNum"
          :limit.sync="queryParamsSoftwarePartVersionPackage.pageSize"
          @pagination="getListSoftwarePartVersionPackage"
        />
      </div>
    </el-drawer>

    <!-- 软件包列表对话框 -->
    <el-dialog title="查询并添加软件包" :visible.sync="openSoftwarePackage" width="900px" append-to-body>
      <el-form :model="queryParamsSoftwarePackage" ref="queryParamsSoftwarePackage" size="small" :inline="true"
               v-show="showSearchSoftwarePackage">
        <el-form-item label="软件包名称" prop="packageName">
          <el-input
            v-model="queryParamsSoftwarePackage.packageName"
            placeholder="请输入软件包名称"
            clearable
            style="width: 140px"
            @keyup.enter.native="handleQuerySoftwarePartVersionPackage"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuerySoftwarePackage">搜索
          </el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuerySoftwarePackage">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            :disabled="multipleSoftwarePackage"
            @click="handleAddBaselineSoftwarePartVersion"
            v-hasPermi="['ota:baseline:baseline:edit']"
          >关联
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearchSoftwarePackage"
                       @queryTable="getListSoftwarePackage"></right-toolbar>
      </el-row>

      <el-table ref="softwarePackageTable" v-loading="loadingSoftwarePackage" :data="softwarePackageList"
                @selection-change="handleSelectionChangeSoftwarePackage">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="软件包名称" prop="packageName"/>
        <el-table-column label="软件包类型" prop="packageType" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.packageType === 1 ? '全量' : '差分' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="软件包来源" prop="packageSource" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.packageSource === 1 ? 'BOM' : 'OTA' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="基础软件零件号" prop="baseSoftwarePn" width="150"/>
        <el-table-column label="基础软件版本" prop="baseSoftwareVer" width="150"/>
        <el-table-column label="适配级别" prop="packageAdaptionLevel" width="150" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.packageAdaptionLevel === 1">基础版本及以下</span>
            <span v-else-if="scope.row.packageAdaptionLevel === 2">基础版本及以上</span>
            <span v-else-if="scope.row.packageAdaptionLevel === 3">与基础版本一致</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column label="是否是OTA包" prop="ota" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.ota ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleAddBaselineSoftwarePartVersion(scope.row)"
              v-hasPermi="['ota:baseline:baseline:edit']"
            >关联
            </el-button>
        </el-table-column>
      </el-table>

      <pagination
        v-show="totalSoftwarePackage>0"
        :total="totalSoftwarePackage"
        :page.sync="queryParamsSoftwarePackage.pageNum"
        :limit.sync="queryParamsSoftwarePackage.pageSize"
        @pagination="getListSoftwarePackage"
      />
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="closeSoftwarePartVersion">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listSoftwarePartVersion,
  listSoftwarePartVersionPackage,
  getSoftwarePartVersion,
  addSoftwarePartVersion,
  addSoftwarePackage,
  updateSoftwarePartVersion,
  delSoftwarePartVersion,
  delSoftwarePackage
} from "@/api/ota/baseline/softwarepartversion";
import {
  listAllEcu,
} from "@/api/ota/baseline/ecu";
import {
  listAllSoftwarePart
} from "@/api/ota/baseline/softwarepart";
import {listSoftwarePackage} from "@/api/ota/baseline/softwarepackage";

export default {
  name: "SoftwarePartVersion",
  dicts: [],
  data() {
    return {
      // 遮罩层
      loading: true,
      loadingSoftwarePartVersionPackage: true,
      loadingSoftwarePackage: true,
      // 选中数组
      ids: [],
      idsSoftwarePartVersionPackage: [],
      idsSoftwarePackage: [],
      // 非单个禁用
      single: true,
      singleSoftwarePartVersionPackage: true,
      singleSoftwarePackage: true,
      // 非多个禁用
      multiple: true,
      multipleSoftwarePartVersionPackage: true,
      multipleSoftwarePackage: true,
      // 显示搜索条件
      showSearch: true,
      showSearchSoftwarePartVersionPackage: true,
      showSearchSoftwarePackage: true,
      // 总条数
      total: 0,
      totalSoftwarePartVersionPackage: 0,
      totalSoftwarePackage: 0,
      // 软件零件表格数据
      softwarePartVersionList: [],
      softwarePartVersionPackageList: [],
      softwarePackageList: [],
      softwarePartList: [],
      softwarePartVerRange: [],
      ecuList: [],
      currentSoftwarePartVersionId: undefined,
      selectEcu: "",
      selectSoftwarePn: "",
      selectKey: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openSoftwarePartVersionPackage: false,
      openSoftwarePackage: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      queryParamsSoftwarePartVersionPackage: {
        pageNum: 1,
        pageSize: 10
      },
      queryParamsSoftwarePackage: {
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
    getListSoftwarePartVersionPackage() {
      this.loadingSoftwarePartVersionPackage = true;
      listSoftwarePartVersionPackage(this.currentSoftwarePartVersionId, this.queryParamsSoftwarePartVersionPackage).then(response => {
          this.softwarePartVersionPackageList = response.rows;
          this.totalSoftwarePartVersionPackage = response.total;
          this.loadingSoftwarePartVersionPackage = false;
        }
      );
    },
    getListSoftwarePackage() {
      this.loadingSoftwarePackage = true;
      listSoftwarePackage(this.queryParamsSoftwarePackage).then(response => {
          this.softwarePackageList = response.rows;
          this.totalSoftwarePackage = response.total;
          this.loadingSoftwarePackage = false;
          this.$nextTick(() => {
            this.setDefaultSelection();
          });
        }
      );
    },
    setDefaultSelection() {
      const linkedIds = this.softwarePartVersionPackageList.map(item => item.id);
      const selectedRows = this.softwarePackageList.filter(item =>
        linkedIds.includes(item.id)
      );
      this.$refs.softwarePackageTable.clearSelection();
      this.$nextTick(() => {
        selectedRows.forEach(row => {
          this.$refs.softwarePackageTable.toggleRowSelection(row, true);
        });
      });
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
      this.softwarePartVerRange = [];
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
    handleQuerySoftwarePartVersionPackage() {
      this.queryParamsSoftwarePartVersionPackage.pageNum = 1;
      this.getListSoftwarePartVersionPackage();
    },
    handleQuerySoftwarePackage() {
      this.queryParamsSoftwarePackage.pageNum = 1;
      this.getListSoftwarePackage();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    resetQuerySoftwarePartVersionPackage() {
      this.resetForm("queryFormSoftwarePartVersionPackage");
      this.handleQuerySoftwarePartVersionPackage();
    },
    resetQuerySoftwarePackage() {
      this.resetForm("queryFormSoftwarePackage");
      this.handleQuerySoftwarePackage();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    handleSelectionChangeSoftwarePartVersionPackage(selection) {
      this.idsSoftwarePartVersionPackage = selection.map(item => item.id)
      this.singleSoftwarePartVersionPackage = selection.length != 1
      this.multipleSoftwarePartVersionPackage = !selection.length
    },
    handleSelectionChangeSoftwarePackage(selection) {
      this.idsSoftwarePackage = selection.map(item => item.id)
      this.singleSoftwarePackage = selection.length != 1
      this.multipleSoftwarePackage = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加软件零件版本信息";
      this.form = {};
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
        const selectedEcu = this.ecuList.find(ecu => ecu.code === value);
        if (selectedEcu) {
          this.selectEcu = selectedEcu.code
        }
      } else {
        this.selectEcu = '';
      }
    },
    handleSoftwarePartSelect(item) {
      this.softwarePartVerRange = item.softwarePartVerRange.split(',');
      this.selectSoftwarePn = item.softwarePn;
    },
    handleSoftwarePartChange(item) {
      if (this.form.softwarePn !== this.selectSoftwarePn) {
        this.softwarePartVerRange = [];
        this.$set(this.form, 'softwarePartVer', '');
        this.$nextTick(() => {
          this.selectKey += 1;
        });
        this.selectSoftwarePn = "";
      }
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
    handleSoftwarePartVersionPackage(row) {
      this.currentSoftwarePartVersionId = row.id;
      this.openSoftwarePartVersionPackage = true;
      this.getListSoftwarePartVersionPackage();
    },
    handleAddSoftwarePackage() {
      this.openSoftwarePackage = true;
      this.getListSoftwarePackage();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ota-baseline/softwarePartVersion/export', {
        ...this.queryParams
      }, `software_part_version_${new Date().getTime()}.xlsx`)
    },
    onSoftwarePartVersionPackageClose() {
      this.getList();
    },
  }
};
</script>
