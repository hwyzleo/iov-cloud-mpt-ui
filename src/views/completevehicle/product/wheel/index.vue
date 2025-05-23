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
      <el-form-item label="轮胎轮毂代码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入轮胎轮毂代码"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="轮胎轮毂名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入轮胎轮毂名称"
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
          v-hasPermi="['completeVehicle:product:wheel:add']"
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
          v-hasPermi="['completeVehicle:product:wheel:edit']"
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
          v-hasPermi="['completeVehicle:product:wheel:remove']"
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
          v-hasPermi="['completeVehicle:product:wheel:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="wheelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="平台代码" prop="platformCode" width="100"/>
      <el-table-column label="车系代码" prop="seriesCode" width="100"/>
      <el-table-column label="轮胎轮毂代码" prop="code" width="100"/>
      <el-table-column label="轮胎轮毂名称" prop="name" />
      <el-table-column label="轮胎轮毂英文名称" prop="nameEn" width="150"/>
      <el-table-column label="是否启用" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :active-value="true"
            :inactive-value="false"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" align="center" width="60"/>
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
            v-hasPermi="['completeVehicle:product:wheel:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['completeVehicle:product:wheel:remove']"
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

    <!-- 添加或修改轮胎轮毂对话框 -->
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
            <el-form-item label="轮胎轮毂代码" prop="code">
              <el-input v-model="form.code" :readonly="form.id !== undefined" placeholder="请输入轮胎轮毂代码"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="轮胎轮毂名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入轮胎轮毂名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="轮胎轮毂英文名称" prop="nameEn">
              <el-input v-model="form.nameEn" placeholder="请输入轮胎轮毂英文名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
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
  </div>
</template>

<script>
import {
  listWheel,
  getWheel,
  addWheel,
  updateWheel,
  delWheel
} from "@/api/completevehicle/product/wheel";
import {
  listAllPlatform
} from "@/api/completevehicle/product/platform";
import {
  listSeriesByPlatformCode
} from "@/api/completevehicle/product/series";

export default {
  name: "Wheel",
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
      // 轮胎轮毂表格数据
      wheelList: [],
      // 车辆平台列表
      platformList: [],
      // 车系列表
      seriesList: [],
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
        code: [
          {required: true, message: "轮胎轮毂代码不能为空", trigger: "blur"}
        ],
        name: [
          {required: true, message: "轮胎轮毂名称不能为空", trigger: "blur"}
        ],
        sort: [
          {required: true, message: "排序不能为空", trigger: "blur"}
        ]
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询轮胎轮毂列表 */
    getList() {
      this.loading = true;
      listWheel(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.wheelList = response.rows;
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
      if(value !== undefined && value !== null && value !== "") {
        listSeriesByPlatformCode(value).then(response => {
          this.seriesList = response;
        });
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      listAllPlatform().then(response => {
        this.platformList = response;
        this.open = true;
      });
      this.title = "添加轮胎轮毂";
      this.form = {
        enable: true,
        sort: 99
      };
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const interiorId = row.id || this.ids
      listAllPlatform().then(response => {
        this.platformList = response;
      });
      getWheel(interiorId).then(response => {
        this.form = response.data;
        listSeriesByPlatformCode(this.form.platformCode).then(response => {
          this.seriesList = response;
          this.open = true;
        });
      });
      this.title = "修改轮胎轮毂";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateWheel(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWheel(this.form).then(response => {
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
      const wheelIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除轮胎轮毂ID为"' + wheelIds + '"的数据项？').then(function () {
        return delWheel(wheelIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('tsp-vmd/mpt/wheel/export', {
        ...this.queryParams
      }, `wheel_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
