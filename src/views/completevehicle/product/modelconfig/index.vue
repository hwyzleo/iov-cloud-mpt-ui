<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="平台代码" prop="platformCode">
        <el-input
          v-model="queryParams.platformCode"
          placeholder="请输入平台代码"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车系代码" prop="seriesCode">
        <el-input
          v-model="queryParams.seriesCode"
          placeholder="请输入车系代码"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车型代码" prop="modelCode">
        <el-input
          v-model="queryParams.modelCode"
          placeholder="请输入车型代码"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="基础车型代码" prop="basicModelCode">
        <el-input
          v-model="queryParams.basicModelCode"
          placeholder="请输入基础车型代码"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车型配置代码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入车型配置代码"
          clearable
          style="width: 170px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车型配置名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入车型配置名称"
          clearable
          style="width: 220px"
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
          v-hasPermi="['completeVehicle:product:modelConfig:add']"
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
          v-hasPermi="['completeVehicle:product:modelConfig:edit']"
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
          v-hasPermi="['completeVehicle:product:modelConfig:remove']"
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
          v-hasPermi="['completeVehicle:product:modelConfig:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="modelConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="平台代码" prop="platformCode" width="80"/>
      <el-table-column label="车系代码" prop="seriesCode" width="80"/>
      <el-table-column label="车型代码" prop="modelCode" width="80"/>
      <el-table-column label="基础车型代码" prop="basicModelCode" width="100"/>
      <el-table-column label="车型配置代码" prop="code" width="150"/>
      <el-table-column label="车型配置名称" prop="name"/>
      <el-table-column label="是否启用" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :active-value="true"
            :inactive-value="false"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" align="center" width="90"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['completeVehicle:product:modelConfig:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['completeVehicle:product:modelConfig:remove']"
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

    <!-- 添加或修改车型配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆平台" prop="platformCode">
              <el-select
                v-model="form.platformCode"
                placeholder="车辆平台"
                clearable
                :disabled="form.id !== undefined"
                @change="handlePlatformChange"
              >
                <el-option
                  v-for="platform in platformList"
                  :key="platform.code"
                  :label="platform.name"
                  :value="platform.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车系" prop="seriesCode">
              <el-select
                v-model="form.seriesCode"
                placeholder="车系"
                clearable
                :disabled="form.id !== undefined"
                @change="handleSeriesChange"
              >
                <el-option
                  v-for="series in seriesList"
                  :key="series.code"
                  :label="series.name"
                  :value="series.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车型" prop="modelCode">
              <el-select
                v-model="form.modelCode"
                placeholder="车型"
                clearable
                :disabled="form.id !== undefined"
                @change="handleModelChange"
              >
                <el-option
                  v-for="model in modelList"
                  :key="model.code"
                  :label="model.name"
                  :value="model.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="基础车型" prop="basicModelCode">
              <el-select
                v-model="form.basicModelCode"
                placeholder="基础车型"
                clearable
                :disabled="form.id !== undefined"
                @change="handleBasicModelChange"
              >
                <el-option
                  v-for="basicModel in basicModelList"
                  :key="basicModel.code"
                  :label="basicModel.name"
                  :value="basicModel.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="车型配置代码" prop="code">
              <el-input v-model="form.code" :readonly="form.id !== undefined" placeholder="请输入车型配置代码"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="车型配置名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入车型配置名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="车型配置英文名称" prop="nameEn">
          <el-input v-model="form.nameEn" placeholder="请输入车型配置英文名称"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车身颜色" prop="exteriorCode">
              <el-select
                v-model="form.exteriorCode"
                placeholder="车身颜色"
                clearable
                :disabled="form.id !== undefined"
                @change="handleModelConfig"
              >
                <el-option
                  v-for="exterior in exteriorList"
                  :key="exterior.code"
                  :label="exterior.name"
                  :value="exterior.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内饰颜色" prop="interiorCode">
              <el-select
                v-model="form.interiorCode"
                placeholder="内饰颜色"
                clearable
                :disabled="form.id !== undefined"
                @change="handleModelConfig"
              >
                <el-option
                  v-for="interior in interiorList"
                  :key="interior.code"
                  :label="interior.name"
                  :value="interior.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="轮胎轮毂" prop="wheelCode">
              <el-select
                v-model="form.wheelCode"
                placeholder="轮胎轮毂"
                clearable
                :disabled="form.id !== undefined"
                @change="handleModelConfig"
              >
                <el-option
                  v-for="wheel in wheelList"
                  :key="wheel.code"
                  :label="wheel.name"
                  :value="wheel.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备胎" prop="spareTireCode">
              <el-radio-group v-model="form.spareTireCode">
                <el-radio
                  label="XZ01"
                >有
                </el-radio>
                <el-radio
                  label="XZ00"
                >无
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="智驾" prop="adasCode">
              <el-radio-group v-model="form.adasCode">
                <el-radio
                  label="XZ02"
                  @click.native="handleAdas('XZ02')"
                >高阶智驾
                </el-radio>
                <el-radio
                  label="XZ00"
                  @click.native="handleAdas('XZ00')"
                >标准智驾
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
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
          </el-col>
        </el-row>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
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
  addModelConfig,
  delModelConfig,
  getModelConfig,
  listModelConfig,
  updateModelConfig
} from "@/api/completevehicle/product/modelconfig";
import {listAllPlatform} from "@/api/completevehicle/product/platform";
import {listSeriesByPlatformCode} from "@/api/completevehicle/product/series";
import {listModelByPlatformCodeAndSeriesCode} from "@/api/completevehicle/product/model";
import {listExteriorByPlatformCodeAndSeriesCode} from "@/api/completevehicle/product/exterior";
import {listInteriorByPlatformCodeAndSeriesCode} from "@/api/completevehicle/product/interior";
import {listWheelByPlatformCodeAndSeriesCode} from "@/api/completevehicle/product/wheel";
import {listBasicModelByPlatformCodeAndSeriesCodeAndModelCode} from "@/api/completevehicle/product/basicmodel";

export default {
  name: "ModelConfig",
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
      // 车型配置表格数据
      modelConfigList: [],
      // 车辆平台列表
      platformList: [],
      // 车系列表
      seriesList: [],
      // 车型列表
      modelList: [],
      // 基础车型列表
      basicModelList: [],
      // 车身颜色列表
      exteriorList: [],
      // 内饰颜色列表
      interiorList: [],
      // 轮胎轮毂列表
      wheelList: [],
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
        platformCode: [
          {required: true, message: "车辆平台代码不能为空", trigger: "blur"}
        ],
        seriesCode: [
          {required: true, message: "车系代码不能为空", trigger: "blur"}
        ],
        modelCode: [
          {required: true, message: "车型代码不能为空", trigger: "blur"}
        ],
        basicModelCode: [
          {required: true, message: "基础车型代码不能为空", trigger: "blur"}
        ],
        code: [
          {required: true, message: "车型配置代码不能为空", trigger: "blur"}
        ],
        name: [
          {required: true, message: "车型配置名称不能为空", trigger: "blur"}
        ],
        exteriorCode: [
          {required: true, message: "车身颜色不能为空", trigger: "blur"}
        ],
        interiorCode: [
          {required: true, message: "内饰颜色不能为空", trigger: "blur"}
        ],
        wheelCode: [
          {required: true, message: "轮胎轮毂不能为空", trigger: "blur"}
        ],
        spareTireCode: [
          {required: true, message: "备胎不能为空", trigger: "blur"}
        ],
        adasCode: [
          {required: true, message: "智驾不能为空", trigger: "blur"}
        ],
        sort: [
          {required: true, message: "排序不能为空", trigger: "blur"}
        ]
      },
    };
  },
  created() {
    this.queryParams.code = this.$route.query.modelConfigCode;
    this.getList();
  },
  methods: {
    /** 查询车型配置列表 */
    getList() {
      this.loading = true;
      listModelConfig(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.modelConfigList = response.rows;
          this.total = response.total;
          this.loading = false;
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
        platformCode: undefined,
        seriesCode: undefined,
        modelCode: undefined,
        code: undefined,
        name: undefined,
        nameEn: undefined,
        enable: true,
        sort: 99
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
    /** 车辆平台下拉选择操作 */
    handlePlatformChange(value) {
      if (value !== undefined && value !== null && value !== "") {
        listSeriesByPlatformCode(value).then(response => {
          this.seriesList = response;
        });
      }
    },
    /** 车系下拉选择操作 */
    handleSeriesChange(value) {
      if (value !== undefined && value !== null && value !== "") {
        listModelByPlatformCodeAndSeriesCode(this.form.platformCode, value).then(response => {
          this.modelList = response;
        });
        listExteriorByPlatformCodeAndSeriesCode(this.form.platformCode, value).then(response => {
          this.exteriorList = response;
        });
        listInteriorByPlatformCodeAndSeriesCode(this.form.platformCode, value).then(response => {
          this.interiorList = response;
        });
        listWheelByPlatformCodeAndSeriesCode(this.form.platformCode, value).then(response => {
          this.wheelList = response;
        });
      }
    },
    /** 车型下拉选择操作 */
    handleModelChange(value) {
      if (value !== undefined && value !== null && value !== "") {
        listBasicModelByPlatformCodeAndSeriesCodeAndModelCode(this.form.platformCode, this.form.seriesCode, value).then(response => {
          this.basicModelList = response;
        });
      }
    },
    /** 基础车型下拉选择操作 */
    handleBasicModelChange(value) {
      if (value !== undefined && value !== null && value !== "") {
        this.handleModelConfig();
      }
    },
    /** 拼接车型配置代码 */
    handleModelConfig() {
      let basicModelCode = this.form.basicModelCode ? this.form.basicModelCode : '';
      let exteriorCode = this.form.exteriorCode ? this.form.exteriorCode : '';
      let interiorCode = this.form.interiorCode ? this.form.interiorCode : '';
      let wheelCode = this.form.wheelCode ? this.form.wheelCode : '';
      this.form.code = basicModelCode + exteriorCode.replace("WS0", "") +
        interiorCode.replace("NS0", "") + wheelCode.replace("CL0", "");
      const basicModelOption = this.basicModelList.find(item => item.code === basicModelCode);
      let basicModelName = basicModelOption ? basicModelOption.name : '';
      const exteriorOption = this.exteriorList.find(item => item.code === exteriorCode);
      let exteriorName = exteriorOption ? exteriorOption.name : '';
      const interiorOption = this.interiorList.find(item => item.code === interiorCode);
      let interiorName = interiorOption ? interiorOption.name : '';
      const wheelOption = this.wheelList.find(item => item.code === wheelCode);
      let wheelName = wheelOption ? wheelOption.name : '';
      this.form.name = basicModelName + " " + exteriorName + " " + interiorName + " " + wheelName;
    },
    handleAdas(adasCode) {
      this.handleModelConfig();
      let adasName = '';
      if (adasCode === 'XZ02') {
        adasCode = '1';
        adasName = '高阶智驾';
      }
      if (adasCode === 'XZ00') {
        adasCode = '0';
        adasName = '标准智驾';
      }
      this.form.code = this.form.code + adasCode;
      this.form.name = this.form.name + " " + adasName;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      listAllPlatform().then(response => {
        this.platformList = response;
        this.open = true;
      });
      this.title = "添加车型配置";
      this.form = {
        enable: true,
        sort: 99
      };
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const modelConfigId = row.id || this.ids
      listAllPlatform().then(response => {
        this.platformList = response;
      });
      getModelConfig(modelConfigId).then(response => {
        this.form = response.data;
        listSeriesByPlatformCode(this.form.platformCode).then(response => {
          this.seriesList = response;
        });
        listModelByPlatformCodeAndSeriesCode(this.form.platformCode, this.form.seriesCode).then(response => {
          this.modelList = response;
        });
        listBasicModelByPlatformCodeAndSeriesCodeAndModelCode(this.form.platformCode, this.form.seriesCode, this.form.modelCode).then(response => {
          this.basicModelList = response;
        });
        this.open = true;
      });
      this.title = "修改车型配置";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateModelConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addModelConfig(this.form).then(response => {
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
      const modelConfigIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除车型配置ID为"' + modelConfigIds + '"的数据项？').then(function () {
        return delModelConfig(modelConfigIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('tsp-vmd/mpt/modelConfig/export', {
        ...this.queryParams
      }, `model_config_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
