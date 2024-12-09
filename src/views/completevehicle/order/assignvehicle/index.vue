<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="订单号" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入订单号"
          clearable
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单状态时间">
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="assignVehicleOrderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="订单号" prop="orderNum" fixed="left" width="150"/>
      <el-table-column label="订单状态" align="center" width="150">
        <template slot-scope="scope">
          <el-tooltip :content="parseTime(scope.row.orderStateTime)" placement="top">
            <span>{{ getVehicleSaleOrderStateLabel(scope.row.orderState) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="车型配置代码" align="center" width="180">
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="openModelConfigTab(scope.row.modelConfigCode)"
          >{{ scope.row.modelConfigCode }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="上牌城市" prop="licenseCity" width="150"/>
      <el-table-column label="交付中心" prop="deliveryCenter" width="150"/>
      <el-table-column label="锁单时间" align="center" prop="lockTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lockTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleAssign(scope.row)"
            v-hasPermi="['vehicle:order:assignVehicle:edit']"
          >分配车辆
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

    <!-- 可分配车辆列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form :model="form" label-width="120px">
        <el-form-item label="销售代码">
          <el-input v-model="form.saleCode" :disabled="true"/>
        </el-form-item>
        <el-form-item label="销售车型名称">
          <el-input v-model="form.modelName" :disabled="true"/>
        </el-form-item>
      </el-form>
      <div class="dialog-body" style="max-height: 50vh; overflow-y: auto;">
        <el-table v-loading="loadingConfig" :data="assignableVehicleList">
          <el-table-column label="配置类型" prop="type" width="100">
            <template slot-scope="scope">
              <span>{{ getSaleModelConfigTypeLabel(scope.row.type) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型代码" prop="typeCode" width="100"/>
          <el-table-column label="类型名称" prop="typeName"/>
          <el-table-column label="类型价格" prop="typePrice" width="100"/>
          <el-table-column label="图片数量" align="center" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.typeImage.length }}</span>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" align="center" width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enable"
                :active-value="true"
                :inactive-value="false"
                disabled
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="排序" prop="sort" width="60"/>
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdateConfig(scope.row)"
                v-hasPermi="['otd:vso:edit']"
              >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDeleteConfig(form.id, scope.row)"
                v-hasPermi="['otd:vso:edit']"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddConfig(form.id)">新 增</el-button>
        <el-button @click="cancelConfigList">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSaleModel,
  getSaleModelConfig,
  listVehicleSaleOrder,
  listSaleModelConfig,
  updateSaleModel,
  updateSaleModelImages,
  updateSaleModelConfig, listModelConfigChangeableOrder, listAssignableOrder
} from "@/api/completevehicle/order/assignvehicle";

export default {
  name: "AssignVehicle",
  dicts: ['iov_vehicle_sale_order_state'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 遮罩层（车型配置）
      loadingConfig: true,
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
      // 待分配车辆销售订单表格数据
      assignVehicleOrderList: [],
      // 可分配车辆表格数据
      assignableVehicleList: [],
      // 弹出层标题
      title: "",
      // 2级弹出层标题
      title2: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（图片维护）
      openImages: false,
      // 是否显示弹出层（车型配置列表）
      openConfigList: false,
      // 是否显示弹出层（车型配置）
      openConfig: false,
      menuExpand: false,
      menuNodeAll: false,
      // 日期范围
      dateRange: [],
      // 菜单列表
      menuOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        saleCode: undefined,
        modelName: undefined
      },
      // 销售车型表单参数
      form: {},
      // 销售车型配置表单参数
      formConfig: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 销售车型表单校验
      rules: {
        saleCode: [
          {required: true, message: "销售代码不能为空", trigger: "blur"}
        ],
        modelName: [
          {required: true, message: "销售车型名称不能为空", trigger: "blur"}
        ],
        sort: [
          {required: true, message: "排序不能为空", trigger: "blur"}
        ]
      },
      // 销售车型配置表单校验
      rulesConfig: {
        saleCode: [
          {required: true, message: "销售代码不能为空", trigger: "blur"}
        ],
        modelName: [
          {required: true, message: "销售车型名称不能为空", trigger: "blur"}
        ],
        sort: [
          {required: true, message: "排序不能为空", trigger: "blur"}
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询可配车车辆销售订单列表 */
    getList() {
      this.loading = true;
      listAssignableOrder(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.assignVehicleOrderList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 获取车辆销售订单状态标签 */
    getVehicleSaleOrderStateLabel(vehicleSaleOrderState) {
      if (!this.dict || !this.dict.type || !this.dict.type.iov_vehicle_sale_order_state) {
        return vehicleSaleOrderState;
      }
      const item = this.dict.type.iov_vehicle_sale_order_state.find(
        dict => dict.value == vehicleSaleOrderState
      )
      return item ? item.label : vehicleSaleOrderState
    },
    /** 跳转账号页 */
    openAccountTab(accountId) {
      const params = { accountId: accountId};
      this.$tab.openPage("账号管理", "/tsp/account", params);
    },
    /** 跳转销售车型页 */
    openSaleModelTab(saleCode) {
      const params = { saleCode: saleCode};
      this.$tab.openPage("销售车型管理", "/otd/saleModel", params);
    },
    /** 跳转车型配置页 */
    openModelConfigTab(modelConfigCode) {
      const params = { modelConfigCode: modelConfigCode};
      this.$tab.openPage("车型配置管理", "/tsp/vmd/modelConfig", params);
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 取消按钮（维护图片） */
    cancelImages() {
      this.openImages = false;
      this.reset();
    },
    /** 取消按钮（车型配置列表） */
    cancelConfigList() {
      this.openConfigList = false;
      this.reset();
    },
    /** 取消按钮（车型配置） */
    cancelConfig() {
      this.openConfig = false;
      this.resetConfig();
    },
    /** 表单重置 */
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.menuExpand = false,
        this.menuNodeAll = false,
        this.deptExpand = true,
        this.deptNodeAll = false,
        this.form = {
          saleCode: undefined,
          modelName: undefined,
          earnestMoney: true,
          earnestMoneyPrice: undefined,
          downPayment: true,
          downPaymentPrice: undefined,
          enable: true,
          sort: 99,
          images: ['']
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
      this.title = "添加销售车型";
      this.form = {
        earnestMoney: true,
        earnestMoneyPrice: 5000,
        downPayment: true,
        downPaymentPrice: 5000,
        enable: true,
        sort: 99
      };
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const saleModelId = row.id || this.ids
      getSaleModel(saleModelId).then(response => {
        this.form = response.data;
        this.open = true;
      });
      this.title = "修改销售车型";
    },
    /** 分配车辆操作 */
    handleAssign(row) {
      getSaleModel(row.id).then(response => {
        this.assignableVehicleList = response.rows;
        this.openImages = true;
      });
      this.title = "图片维护";
    },
    /** 车型配置操作 */
    handleConfig(row) {
      this.reset();
      getSaleModel(row.id).then(response => {
        this.form = response.data;
      });
      listSaleModelConfig(row.id).then(response => {
        this.saleModelConfigList = response.rows;
        this.loadingConfig = false;
        this.openConfigList = true;
      });
      this.title = "车型配置";
    },
    /** 获取销售车型配置类型 */
    getSaleModelConfigTypeLabel(saleModelConfigType) {
      if (!this.dict || !this.dict.type || !this.dict.type.iov_sale_model_config_type) {
        return saleModelConfigType;
      }
      const item = this.dict.type.iov_sale_model_config_type.find(
        dict => dict.value === saleModelConfigType
      )
      return item ? item.label : saleModelConfigType
    },
    /** 添加图片 */
    addImage() {
      this.form.images.push('')
    },
    /** 添加配置图片 */
    addConfigImage() {
      this.formConfig.typeImage.push('')
    },
    /** 删除图片 */
    removeImage(index) {
      this.form.images.splice(index, 1)
    },
    /** 删除配置图片 */
    removeConfigImage(index) {
      this.formConfig.typeImage.splice(index, 1)
    },
    /** 验证图片URL是否有效 */
    validateImage(index) {
      const url = this.form.images[index]
      if (url && !this.isValidImage(url)) {
        this.$message.warning('请输入有效的图片URL地址')
      }
    },
    /** 验证配置图片URL是否有效 */
    validateConfigImage(index) {
      const url = this.formConfig.typeImage[index]
      if (url && !this.isValidImage(url)) {
        this.$message.warning('请输入有效的图片URL地址')
      }
    },
    /** 检查URL是否是有效的图片地址 */
    isValidImage(url) {
      return url && url.match(/\.(jpeg|jpg|gif|png)$/i) != null
    },
    /** 新增车型配置按钮操作 */
    handleAddConfig(saleModelId) {
      this.resetConfig();
      getSaleModel(saleModelId).then(response => {
        this.formConfig = {
          saleCode: response.data.saleCode,
          typeImage: [''],
          enable: true,
          sort: 99
        };
        this.openConfig = true;
      });
      this.title2 = "添加销售车型配置";
    },
    /** 修改车型配置按钮操作 */
    handleUpdateConfig(row) {
      this.resetConfig();
      const saleModelConfigId = row.id || this.ids
      getSaleModelConfig(this.form.id, saleModelConfigId).then(response => {
        this.formConfig = response.data;
        this.openConfig = true;
      });
      this.title2 = "修改销售车型配置";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateSaleModel(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSaleModel(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 提交按钮（维护图片） */
    submitImages: function () {
      if (this.form.id !== undefined) {
        updateSaleModelImages(this.form).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.openImages = false;
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const vehicleSaleOrderIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除车辆销售订单ID为"' + vehicleSaleOrderIds + '"的数据项？').then(function () {
        return delVehicleSaleOrder(vehicleSaleOrderIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('otd-vso/mpt/saleModel/export', {
        ...this.queryParams
      }, `sale_model_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
