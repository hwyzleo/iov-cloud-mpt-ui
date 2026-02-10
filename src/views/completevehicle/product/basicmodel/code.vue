<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="特征值代码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入特征值代码"
          clearable
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="特征值名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入特征值名称"
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
          v-hasPermi="['completeVehicle:product:featureFamily:add']"
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
          v-hasPermi="['completeVehicle:product:featureFamily:edit']"
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
          v-hasPermi="['completeVehicle:product:featureFamily:remove']"
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
          v-hasPermi="['completeVehicle:product:featureFamily:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="特征族" prop="familyCode">
        <template slot-scope="scope">
          <span>{{ scope.row.familyCode + '：' + scope.row.familyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="特征值" prop="featureCode">
        <template slot-scope="scope">
          <span>{{ scope.row.featureCode + '：' + scope.row.featureName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="特征值类型" prop="featureType"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
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
            v-hasPermi="['completeVehicle:product:featureFamily:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['completeVehicle:product:featureFamily:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="特征族" prop="familyCode">
              <el-select
                v-model="form.familyCode"
                placeholder="特征族"
                style="width: 100%"
                clearable
                :disabled="form.id !== undefined"
                @change="getAllFeatureCode(form.familyCode)"
              >
                <el-option
                  v-for="featureFamily in featureFamilyList"
                  :key="featureFamily.code"
                  :label="featureFamily.name"
                  :value="featureFamily.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="特征值类型" prop="featureType">
              <el-select v-model="form.featureType" placeholder="特征值类型" style="width: 100%" clearable>
                <el-option key="S" label="S" value="S" />
                <el-option key="O" label="O" value="O" />
                <el-option key="-" label="-" value="-" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="特征值" prop="featureCode">
          <el-select
            v-model="form.featureCode"
            placeholder="特征值"
            style="width: 100%;"
            multiple
            clearable
          >
            <el-option
              v-for="featureCode in featureCodeList"
              :key="featureCode.code"
              :label="featureCode.name"
              :value="featureCode.code"
            />
          </el-select>
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
  listBasicModelFeatureCode,
  getBasicModelFeatureCode,
  addBasicModelFeatureCode,
  updateBasicModelFeatureCode,
  delBasicModelFeatureCode
} from "@/api/completevehicle/product/basicmodel";
import {
  listAllFeatureFamily,
  listAllFeatureCode
} from "@/api/completevehicle/product/featurefamily";

export default {
  name: "BasicModelFeatureCode",
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
      // 表格数据
      list: [],
      featureFamilyList: [],
      featureCodeList: [],
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
        code: [
          {required: true, message: "特征值代码不能为空", trigger: "blur"}
        ],
        name: [
          {required: true, message: "特征值名称不能为空", trigger: "blur"}
        ]
      },
      familyId: undefined,
      familyCode: undefined
    };
  },
  created() {
    this.basicModelCode = this.$route.query.code;
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listBasicModelFeatureCode(this.basicModelCode, this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.list = response.data;
          this.loading = false;
        }
      );
    },
    getAllFeatureCode(familyCode) {
      listAllFeatureCode(familyCode).then(response => {
        this.featureCodeList = response.data;
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
        basicModelCode: undefined,
        familyCode: undefined,
        featureCode: undefined
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
      this.featureFamilyList = [];
      listAllFeatureFamily().then(response => {
        response.data.forEach(featureFamily => {
          let flag = true;
          this.list.forEach(featureCode => {
            if (featureFamily.code === featureCode.familyCode) {
              flag = false;
            }
          })
          if (flag) {
            this.featureFamilyList.push(featureFamily);
          }
        });
        this.open = true;
        this.title = "添加基础车型特征值";
        this.form = {
          basicModelCode: this.basicModelCode
        };
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      this.featureFamilyList = [];
      listAllFeatureFamily().then(response => {
        this.featureFamilyList = response.data;
        getBasicModelFeatureCode(this.basicModelCode, id).then(response => {
          this.form = response.data;
          this.getAllFeatureCode(this.form.familyCode);
          this.open = true;
        });
        this.title = "修改基础车型特征值";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.code = this.familyCode + this.form.codeSuffix;
          if (this.form.id !== undefined) {
            updateBasicModelFeatureCode(this.basicModelCode, this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBasicModelFeatureCode(this.basicModelCode, this.form).then(response => {
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
      const ids = row.id || this.ids;
      const basicModelCode = this.basicModelCode;
      this.$modal.confirm('是否确认删除特征族ID为"' + ids + '"的数据项？').then(function () {
        return delBasicModelFeatureCode(basicModelCode, ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
    }
  }
};
</script>
