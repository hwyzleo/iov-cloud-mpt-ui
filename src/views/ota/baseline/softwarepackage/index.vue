<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="软件包名称" prop="packageName">
        <el-input
          v-model="queryParams.packageName"
          placeholder="请输入软件包名称"
          clearable
          style="width: 140px"
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
          v-hasPermi="['ota:baseline:softwarePackage:add']"
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
          v-hasPermi="['ota:baseline:softwarePackage:edit']"
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
          v-hasPermi="['ota:baseline:softwarePackage:remove']"
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
          v-hasPermi="['ota:baseline:softwarePackage:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="softwarePackageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="软件包名称" prop="packageName"/>
      <el-table-column label="软件包类型" prop="packageType" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.packageType===1 ? '全量' : '差分' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="软件包来源" prop="packageSource" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.packageSource===1 ? 'BOM' : 'OTA' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="基础软件零件号" prop="baseSoftwarePn" width="150"/>
      <el-table-column label="基础软件版本" prop="baseSoftwareVer" width="150"/>
      <el-table-column label="适配级别" prop="packageAdaptionLevel" width="100" align="center">
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
            v-hasPermi="['ota:baseline:softwarePackage:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ota:baseline:softwarePackage:remove']"
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

    <!-- 添加或修改软件包信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-form-item label="软件零件版本" prop="softwarePartVersionId">
          <el-select
            v-model="form.softwarePartVersionId"
            placeholder="软件零件版本"
            clearable
          >
            <el-option
              v-for="softwarePartVersion in this.softwarePartVersionList"
              :key="softwarePartVersion.id"
              :label="softwarePartVersion.ecuCode + '-' + softwarePartVersion.softwarePn + '-' + softwarePartVersion.softwarePartVer"
              :value="softwarePartVersion.id"
            />
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="软件包来源" prop="softwareSource">
              <el-select
                v-model="form.packageSource"
                placeholder="软件包来源"
                clearable
              >
                <el-option key="1" label="BOM" value="1" />
                <el-option key="2" label="OTA" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="软件包类型" prop="packageType">
              <el-select
                v-model="form.packageType"
                placeholder="软件包类型"
                clearable
              >
                <el-option key="1" label="全量" value="1" />
                <el-option key="2" label="差分" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="软件包名称" prop="packageName">
          <el-input v-model="form.packageName" placeholder="请输入软件包名称"/>
        </el-form-item>
        <el-form-item label="软件包代码" prop="packageCode">
          <el-input v-model="form.packageCode" placeholder="请输入软件包代码"/>
        </el-form-item>
        <el-form-item label="软件包URL" prop="packageCode">
          <el-input v-model="form.packageUrl" placeholder="请输入软件包URL"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="软件包大小（Byte）" prop="packageSize">
              <el-input v-model="form.packageSize" placeholder="请输入软件包大小"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="软件包MD5" prop="packageMd5">
              <el-input v-model="form.packageMd5" placeholder="请输入软件包MD5"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="软件包说明" prop="packageDesc">
          <el-input v-model="form.packageDesc" type="textarea" placeholder="请输入软件包说明"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="基础软件零件号" prop="baseSoftwarePn">
              <el-input v-model="form.baseSoftwarePn" placeholder="请输入基础软件零件号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="基础软件版本" prop="baseSoftwareVer">
              <el-input v-model="form.baseSoftwareVer" placeholder="请输入基础软件版本"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="软件包适配级别" prop="packageAdaptionLevel">
              <el-select
                v-model="form.packageAdaptionLevel"
                placeholder="软件包适配级别"
                clearable
              >
                <el-option key="1" label="基础版本及以下" value="1" />
                <el-option key="2" label="基础版本及以上" value="2" />
                <el-option key="3" label="与基础版本一致" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适配总成软件零件号" prop="adaptedSoftwarePn">
              <el-input v-model="form.adaptedSoftwarePn" placeholder="请输入适配的总成软件零件号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发布日期" prop="publishDate">
              <el-date-picker
                v-model="form.publishDate"
                type="date"
                placeholder="请选择发布日期"
                value-format="timestamp"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计升级时间" prop="estimatedInstallTime">
              <el-input-number v-model="form.estimatedInstallTime" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="是否是OTA包">
          <el-radio-group v-model="form.ota">
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
  listSoftwarePackage,
  listAllSoftwarePartVersion,
  getSoftwarePackage,
  addSoftwarePackage,
  updateSoftwarePackage,
  delSoftwarePackage
} from "@/api/ota/baseline/softwarepackage";

export default {
  name: "SoftwarePackage",
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
      // 软件包表格数据
      softwarePackageList: [],
      softwarePartVersionList: [],
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
        softwarePartVersionId: [
          {required: true, message: "软件零件版本不能为空", trigger: "blur"}
        ],
        packageName: [
          {required: true, message: "软件包名称不能为空", trigger: "blur"}
        ],
        packageType: [
          {required: true, message: "软件包类型不能为空", trigger: "blur"}
        ],
        packageSource: [
          {required: true, message: "软件包来源不能为空", trigger: "blur"}
        ],
        baseSoftwarePn: [
          {required: true, message: "基础软件零件号不能为空", trigger: "blur"}
        ],
        baseSoftwareVer: [
          {required: true, message: "基础软件版本不能为空", trigger: "blur"}
        ],
        packageAdaptionLevel: [
          {required: true, message: "软件包适配级别不能为空", trigger: "blur"}
        ],
        adaptedSoftwarePn: [
          {required: true, message: "适配的总成软件零件号不能为空", trigger: "blur"}
        ],
        publishDate: [
          {required: true, message: "发布日期不能为空", trigger: "blur"}
        ]
      },
    };
  },
  created() {
    this.getSoftwarePartVersionList();
    this.getList();
  },
  methods: {
    /** 查询软件包列表 */
    getList() {
      this.loading = true;
      listSoftwarePackage(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.softwarePackageList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    getSoftwarePartVersionList() {
      listAllSoftwarePartVersion().then(response => {
          this.softwarePartVersionList = response.data;
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
        softwarePartVersionId: undefined,
        packageCode: undefined,
        packageName: undefined,
        packageType: undefined,
        packageSize: undefined,
        packageMd5: undefined,
        packageDesc: undefined,
        packageSource: undefined,
        baseSoftwarePn: undefined,
        baseSoftwareVer: undefined,
        packageAdaptionLevel: undefined,
        adaptedSoftwarePn: undefined,
        publishDate: undefined,
        estimatedInstallTime: undefined,
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
      this.title = "添加软件包信息";
      this.form = {
        ota: true
      };
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const softwarePackageId = row.id || this.ids
      getSoftwarePackage(softwarePackageId).then(response => {
        this.form = response.data;
        this.open = true;
      });
      this.title = "修改软件包信息";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateSoftwarePackage(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSoftwarePackage(this.form).then(response => {
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
      const softwarePackageIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除软件包ID为"' + softwarePackageIds + '"的数据项？').then(function () {
        return delSoftwarePackage(softwarePackageIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ota-baseline/softwarePackage/export', {
        ...this.queryParams
      }, `software_package_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
