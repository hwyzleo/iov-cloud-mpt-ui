<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['ota:fota:fixedConfigWord:add']"
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
          v-hasPermi="['ota:fota:fixedConfigWord:edit']"
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
          v-hasPermi="['ota:fota:fixedConfigWord:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="设备" prop="deviceCode" width="150">
        <template slot-scope="scope">
          <span>{{ deviceCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="软件零件号" prop="softwarePn" width="150">
        <template slot-scope="scope">
          <span>{{ softwarePn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置字版本" prop="configWordVersion" width="150" align="center">
      </el-table-column>
      <el-table-column label="起始byte" prop="startByte" width="150" align="center"/>
      <el-table-column label="起始bit" prop="startBit" width="150" align="center"/>
      <el-table-column label="配置字值" prop="configWordValue" width="150" align="center"/>
      <el-table-column label="描述" prop="description"/>
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
            v-hasPermi="['ota:fota:fixedConfigWord:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ota:fota:fixedConfigWord:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改升级任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="设备" prop="deviceCode">
          <el-input v-model="form.deviceCode" placeholder="请输入设备" readonly/>
        </el-form-item>
        <el-form-item label="软件零件号" prop="softwarePn">
          <el-input v-model="form.softwarePn" placeholder="请输入软件零件号" readonly/>
        </el-form-item>
        <el-form-item label="配置字版本" prop="configWordVersion">
          <el-input v-model="form.configWordVersion" placeholder="请输入配置字版本"/>
        </el-form-item>
        <el-form-item label="起始byte" prop="startByte">
          <el-input v-model="form.startByte" placeholder="请输入起始byte"/>
        </el-form-item>
        <el-form-item label="起始bit" prop="startBit">
          <el-input v-model="form.startBit" placeholder="请输入起始bit"/>
        </el-form-item>
        <el-form-item label="配置字值" prop="configWordValue">
          <el-input v-model="form.configWordValue" placeholder="请输入配置字值"/>
        </el-form-item>
        <el-form-item label="依赖零件设备" prop="dependDevice">
          <el-select
            v-model="form.dependDevice"
            placeholder="依赖零件设备"
            clearable
          >
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入描述内容"></el-input>
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
  addSoftwareBuildVersionConfigWord,
  delSoftwareBuildVersionConfigWord,
  getSoftwareBuildVersion, getSoftwareBuildVersionConfigWord,
  listSoftwareBuildVersionConfigWord,
  updateSoftwareBuildVersionConfigWord,
} from "@/api/ota/baseline/softwarebuildversion";

export default {
  name: "SoftwareBuildVersionConfigWord",
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
        startByte: [
          {required: true, message: "起始byte不能为空", trigger: "blur"}
        ],
        startBit: [
          {required: true, message: "起始bit不能为空", trigger: "blur"}
        ],
        configWordValue: [
          {required: true, message: "配置字值不能为空", trigger: "blur"}
        ],
        description: [
          {required: true, message: "描述不能为空", trigger: "blur"}
        ]
      },
      softwareBuildVersionId: undefined,
      deviceCode: undefined,
      softwarePn: undefined,
    };
  },
  created() {
    this.softwareBuildVersionId = this.$route.query.id;
    getSoftwareBuildVersion(this.softwareBuildVersionId).then(response => {
      this.deviceCode = response.data.deviceCode;
      this.softwarePn = response.data.softwarePn;
    });
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listSoftwareBuildVersionConfigWord(this.softwareBuildVersionId).then(response => {
        this.list = response.data;
        this.loading = false;
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
        name: undefined
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
      this.title = "添加配置字";
      this.form = {
        softwareBuildVersionId: this.softwareBuildVersionId,
        deviceCode: this.deviceCode,
        softwarePn: this.softwarePn
      };
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const configWordId = row.id || this.ids
      getSoftwareBuildVersionConfigWord(this.softwareBuildVersionId, configWordId).then(response => {
        this.form = response.data;
        this.form.softwareBuildVersionId = this.softwareBuildVersionId;
        this.form.deviceCode = this.deviceCode;
        this.form.softwarePn = this.softwarePn;
        this.open = true;
      });
      this.title = "修改配置字";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateSoftwareBuildVersionConfigWord(this.softwareBuildVersionId, this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSoftwareBuildVersionConfigWord(this.softwareBuildVersionId, this.form).then(response => {
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
      const softwareBuildVersionId = this.softwareBuildVersionId;
      const configWordIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除配置字ID为"' + configWordIds + '"的数据项？').then(function () {
        return delSoftwareBuildVersionConfigWord(softwareBuildVersionId, configWordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch((error) => {
        console.error("删除失败，错误信息：", error);
        this.$modal.msgError("删除失败");
      });
    },
    /** 导出按钮操作 */
    handleExport() {
    },
  }
};
</script>
