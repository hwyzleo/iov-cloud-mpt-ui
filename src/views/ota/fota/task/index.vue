<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="任务名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入任务名称"
          clearable
          style="width: 150px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务状态" prop="type">
        <el-select
          v-model="queryParams.state"
          placeholder="任务状态"
          clearable
          style="width: 140px"
        >
          <el-option
            v-for="taskState in this.taskStateList"
            :key="taskState.value"
            :label="taskState.label"
            :value="taskState.value"
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
          v-hasPermi="['ota:fota:task:add']"
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
          v-hasPermi="['ota:fota:task:edit']"
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
          v-hasPermi="['ota:fota:task:remove']"
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
          v-hasPermi="['ota:fota:task:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="任务名称" prop="name"/>
      <el-table-column label="任务类型" prop="type" width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">普通</span>
          <span v-else-if="scope.row.type === 2">快速</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="任务阶段" prop="stage" width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.stage === 1">验证</span>
          <span v-else-if="scope.row.stage === 2">灰度</span>
          <span v-else-if="scope.row.stage === 3">发布</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="任务开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务发布时间" align="center" prop="publishTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.publishTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="升级模式" prop="upgradeMode" width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.upgradeMode === 1">普通</span>
          <span v-else-if="scope.row.upgradeMode === 2">强制</span>
          <span v-else-if="scope.row.upgradeMode === 3">预约静默</span>
          <span v-else-if="scope.row.upgradeMode === 4">远程静默</span>
          <span v-else-if="scope.row.upgradeMode === 5">工厂</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" prop="state" width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state === 1">待提交</span>
          <span v-else-if="scope.row.state === 2">待审核</span>
          <span v-else-if="scope.row.state === 3">已审核</span>
          <span v-else-if="scope.row.state === 4">未通过</span>
          <span v-else-if="scope.row.state === 5">已发布</span>
          <span v-else-if="scope.row.state === 6">已暂停</span>
          <span v-else-if="scope.row.state === 7">已结束</span>
          <span v-else-if="scope.row.state === 8">已取消</span>
          <span v-else>未知</span>
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
            v-hasPermi="['ota:fota:task:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ota:fota:task:remove']"
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

    <!-- 添加或修改升级任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入任务名称"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务类型" prop="type">
              <el-select
                v-model="form.type"
                placeholder="任务类型"
                clearable
              >
                <el-option :key="1" label="普通" :value="1"/>
                <el-option :key="2" label="快速" :value="2"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务阶段" prop="stage">
              <el-select
                v-model="form.stage"
                placeholder="任务阶段"
                clearable
              >
                <el-option :key="1" label="验证" :value="1"/>
                <el-option :key="2" label="灰度" :value="2"/>
                <el-option :key="3" label="发布" :value="3"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="升级活动" prop="activityName">
          <div>
            <el-autocomplete
              v-model="form.activityName"
              :fetch-suggestions="queryActivity"
              placeholder="请查询升级活动"
              :trigger-on-focus="false"
              clearable
              @select="handleActivitySelect"
            >
              <template #default="{ item }">
                <div>{{ item.name }}[{{ item.version }}]</div>
              </template>
            </el-autocomplete>
          </div>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务开始时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="请选择任务开始时间"
                value-format="timestamp"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="请选择任务结束时间"
                value-format="timestamp"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="升级模式" prop="upgradeMode">
          <el-select
            v-model="form.upgradeMode"
            placeholder="升级模式"
            clearable
          >
            <el-option :key="1" label="普通" :value="1"/>
            <el-option :key="2" label="强制" :value="2"/>
            <el-option :key="3" label="预约静默" :value="3"/>
            <el-option :key="4" label="远程静默" :value="4"/>
            <el-option :key="5" label="工厂" :value="5"/>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="ECU尝试刷写次数" prop="ecuTryLimit">
              <el-input-number v-model="form.ecuTryLimit" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="刷写失败是否回滚" prop="failRollback">
              <el-radio-group v-model="form.failRollback">
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
        </el-row>
        <el-form-item label="适配主体" prop="adaptation">
          <el-select
            v-model="form.adaptation"
            placeholder="适配主体"
            clearable
          >
            <el-option :key="1" label="软件零件号" :value="1"/>
            <el-option :key="2" label="软件版本" :value="2"/>
            <el-option :key="3" label="两者均适配" :value="3"/>
            <el-option :key="4" label="两者均不适配" :value="4"/>
          </el-select>
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
  addTask,
  delTask,
  getTask,
  listTask,
  listAllTaskState,
  updateTask
} from "@/api/ota/fota/task";
import {listArticle} from "@/api/ota/fota/article";

export default {
  name: "Task",
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
      // 升级任务表格数据
      taskList: [],
      taskStateList: [],
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
        name: [
          {required: true, message: "任务名称不能为空", trigger: "blur"}
        ],
        type: [
          {required: true, message: "任务类型不能为空", trigger: "blur"}
        ],
        stage: [
          {required: true, message: "任务阶段不能为空", trigger: "blur"}
        ],
        activityName: [
          {required: true, message: "升级活动不能为空", trigger: "blur"}
        ],
        startTime: [
          {required: true, message: "任务开始时间不能为空", trigger: "blur"}
        ],
        endTime: [
          {required: true, message: "任务结束时间不能为空", trigger: "blur"}
        ],
        upgradeMode: [
          {required: true, message: "升级模式不能为空", trigger: "blur"}
        ],
        adaptation: [
          {required: true, message: "适配主体不能为空", trigger: "blur"}
        ]
      },
    };
  },
  created() {
    this.getTaskStateList();
    this.getList();
  },
  methods: {
    /** 查询升级任务列表 */
    getList() {
      this.loading = true;
      listTask(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.taskList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    getTaskStateList() {
      listAllTaskState().then(response => {
          this.taskStateList = response.data;
        }
      );
    },
    queryActivity(queryString, cb) {
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
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        name: undefined,
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
      this.title = "添加升级任务";
      this.form = {};
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const taskId = row.id || this.ids
      getTask(taskId).then(response => {
        this.form = response.data;
        this.open = true;
      });
      this.title = "修改升级任务";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateTask(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTask(this.form).then(response => {
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
      const taskIds = row.id || this.ids;
      this.$modal.confirm('是否确认删除升级任务ID为"' + taskIds + '"的数据项？').then(function () {
        return delTask(taskIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ota-fota/task/export', {
        ...this.queryParams
      }, `task_${new Date().getTime()}.xlsx`)
    },
    handleActivitySelect(item) {
      this.form.activityId = item.id;
    },
  }
};
</script>
