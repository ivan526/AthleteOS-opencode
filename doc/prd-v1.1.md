# AthleteOS 产品需求文档 PRD

版本：MVP v1.1
产品名称：AthleteOS
产品定位：AI-Powered Endurance Training Coach / Personal Digital Coach
目标：构建一个综合、智能、可解释、以安全为优先的耐力训练计划跟踪与决策产品

---

# 1. 产品愿景

AthleteOS 是一个面向耐力运动员的智能训练决策系统。

它不是单纯的训练记录工具，也不是一个让大模型自由生成训练建议的 AI Chat Bot。

AthleteOS 的核心价值是：

> 将用户已有的训练数据、恢复状态、执行反馈和长期目标，转化为每天可执行、可解释、可调整的训练建议。

系统通过接入 Intervals.icu 等训练数据源，持续构建用户的 Digital Athlete Model，并基于运动科学模型、规则引擎和用户反馈，完成：

* 每日训练状态评估
* 今日训练建议生成
* 训练风险识别
* 训练计划动态调整
* 每周训练总结
* 长期目标跟踪
* AI 教练解释与反馈

AthleteOS 的长期目标是成为用户的：

> Personal Digital Coach
> 个人数字教练

帮助用户减少盲目训练，更稳定、更可预测地提升表现。

---

# 2. 产品核心判断

## 2.1 不做什么

AthleteOS 不是：

* 另一个训练记录 App
* 另一个 AI 聊天机器人
* 另一个复杂数据看板
* 另一个静态训练计划生成器
* 另一个社交运动社区

## 2.2 要做什么

AthleteOS 要解决的是：

> 用户每天打开产品后，10 秒内知道今天该怎么练、为什么这样练、是否需要调整。

产品重点不是展示更多数据，而是把复杂训练数据转化为清晰行动。

---

# 3. 产品定位

## 3.1 竞品关系

| 产品            | 核心定位       | 用户主要问题              |
| ------------- | ---------- | ------------------- |
| Garmin        | 记录设备与生态    | 数据多，但决策解释有限         |
| Intervals.icu | 高级训练数据分析平台 | 数据专业，但普通用户难转化为行动    |
| TrainingPeaks | 教练与计划管理工具  | 更偏教练工作台，个人自动化不足     |
| AthleteOS     | 智能训练决策系统   | 直接回答今天该练什么、为什么、如何调整 |

## 3.2 产品一句话

AthleteOS 是一个面向耐力运动员的智能训练决策系统，基于训练负荷、恢复状态、执行反馈和目标进度，每天给出可解释、可调整、以安全为优先的训练建议。

---

# 4. 目标用户

## 4.1 第一阶段核心用户

第一阶段优先服务：

* 跑步、骑行、半马、全马、铁人三项入门用户
* 每周训练 4-10 次
* 已经使用 Garmin、Coros、Apple Watch 等设备
* 已经将数据同步至 Intervals.icu
* 对训练提升有明确目标
* 看得懂或至少听说过 TSS、CTL、ATL、Form、FTP、HRV 等指标
* 不一定有真人教练
* 希望每天获得更清晰的训练建议

## 4.2 早期高价值用户

最适合作为早期用户的人群：

* 使用 Intervals.icu 或 TrainingPeaks
* 有半马、全马、FTP、骑行赛事等明确目标
* 能坚持记录训练
* 愿意根据数据调整训练
* 对“今天该不该练强度”经常犹豫
* 担心过度训练或伤病
* 不想请长期真人教练，但需要数字化指导

---

# 5. 核心问题

## 问题 1：知道自己练了多少，但不知道今天该练什么

用户能看到大量数据：

* CTL
* ATL
* Form
* TSS
* HRV
* Sleep
* Weekly Load
* Pace
* Power

但这些数据并不会自动告诉用户：

* 今天能不能练？
* 今天练多狠？
* 今天适合间歇、节奏、轻松跑，还是恢复？
* 如果睡眠不好，原计划要不要改？
* 如果连续几天训练，今天是否需要休息？

## 问题 2：训练计划是静态的，但人的状态是动态的

现实中用户会遇到：

* 睡眠差
* 工作压力大
* 加班
* 出差
* 感冒
* 腿部不适
* 时间不足
* 跳过训练
* 临时多练

传统训练计划无法实时调整。

## 问题 3：数据多，但无法转化成行动

例如：

* Form = -18
* ACWR = 1.42
* Monotony = 2.1
* Sleep Score = 58

多数用户不知道这些意味着什么。

AthleteOS 要把这些数据转化为：

> 今天建议降低强度，因为近期负荷增长偏快，恢复不足，继续高强度可能影响后续训练质量。

---

# 6. 产品目标

## Goal 1：每日训练决策自动化

用户每天打开 AthleteOS，立即知道：

* 今天是否适合训练
* 今天适合什么类型训练
* 建议训练时长
* 预计训练负荷
* 是否需要恢复
* 为什么这样安排

## Goal 2：降低过度训练和训练中断风险

通过以下维度综合判断训练风险：

* Form
* ACWR
* Monotony
* Strain
* Sleep
* HRV
* Subjective Fatigue
* Recent Load
* Intensity Density
* Training Adherence

系统必须优先避免过度训练。

原则：

> 宁可少练，不要受伤。
> 优先长期稳定进步，不追求单日最大训练量。

## Goal 3：让训练计划可动态调整

系统必须支持根据用户实际状态调整今日训练：

* 用户反馈太累
* 用户反馈没时间
* 用户反馈疼痛或不适
* 用户反馈只能室内训练
* 用户反馈想换成骑行
* 用户跳过训练
* 用户提前完成或超量完成

## Goal 4：让 AI 解释训练决策，而不是决定训练负荷

AI Coach 负责：

* 解释
* 教育
* 总结
* 鼓励
* 问答
* 把专业指标转化为用户能理解的话

AI Coach 不负责：

* 直接决定训练负荷
* 推翻安全规则
* 推翻训练风险判断
* 推翻目标约束
* 自行生成高强度训练建议

---

# 7. 产品核心原则

## 7.1 Rule Engine First

训练决策必须来自：

* 运动科学模型
* 规则系统
* 用户状态
* 训练数据
* 安全规则
* 执行反馈

不能由大模型直接决定。

## 7.2 Explainable

每一条训练建议都必须可解释。

系统必须保留：

* 输入数据
* 触发规则
* 决策结果
* 置信度
* 证据
* 用户可读解释

## 7.3 Safety First

安全规则拥有最高优先级。

任何训练决策都不能绕过 Hard Safety Rules。

优先级：

```text
Hard Safety Rules
>
Training Risk Modifier
>
Training Capacity Decision
>
Goal Phase
>
Workout Generator
>
AI Coach Explanation
```

## 7.4 Long-Term Adaptation

系统优先长期能力增长。

不以单日训练量最大化为目标。

## 7.5 User Control

系统给建议，但用户保留调整权。

用户可以反馈：

* 太累
* 没时间
* 不舒服
* 想换项目
* 已完成
* 跳过
* 调整训练

系统根据反馈重新生成建议。

---

# 8. 核心概念定义

## 8.1 Training Capacity

Training Capacity 是 AthleteOS 的唯一用户主指标。

含义：

> 用户今天可承受训练刺激的综合能力。

范围：

```text
0 - 100
```

用户可见等级：

| 分数     | 状态                | 用户展示文案         | 训练建议方向          |
| ------ | ----------------- | -------------- | --------------- |
| 81-100 | Ready To Push     | 状态很好，可以安排高质量训练 | Hard / Quality  |
| 61-80  | Train Normally    | 状态稳定，适合正常训练    | Moderate        |
| 41-60  | Reduce Intensity  | 状态一般，建议降低强度    | Easy            |
| 0-40   | Recovery Required | 恢复优先，建议休息或恢复训练 | Recovery / Rest |

首页 Today 只展示 Training Capacity，不展示 Readiness 作为主指标。

## 8.2 Readiness

Readiness 不再作为用户主指标。

Readiness 是 Training Capacity 的内部子维度，表示用户当前恢复状态。

Readiness 可由以下因素组成：

* Sleep Score
* HRV Score
* Subjective Fatigue
* Recovery Trend
* Form

使用规则：

* 可在 Debug 或 Advanced Detail 中展示
* 不在 Today 首页作为主指标展示
* 不与 Training Capacity 并列，避免用户困惑

## 8.3 Training Risk

原 Injury Risk 在用户界面中统一表达为 Training Risk。

内部仍可保留 risk_score，用于规则计算。

用户侧不直接表达为“受伤概率”。

原因：

* 系统无法医学诊断
* 受伤预测具有不确定性
* 直接说“受伤概率 75%”会造成误导

用户侧表达：

| 内部 risk_score | 用户侧等级        | 用户侧文案          |
| ------------- | ------------ | -------------- |
| <0.25         | Low          | 训练风险较低         |
| 0.25-0.50     | Moderate     | 训练风险略有上升       |
| 0.50-0.75     | Elevated     | 训练风险偏高，建议避免高强度 |
| >0.75         | High Caution | 训练风险较高，建议恢复优先  |

禁止用户侧表达：

* 受伤概率为 xx%
* 你会受伤
* 医学诊断式结论
* 确定性疾病判断

允许用户侧表达：

* 训练风险偏高
* 近期负荷增长较快
* 恢复状态不足
* 建议降低强度
* 如已有疼痛或不适，请优先休息或咨询专业人士

---

# 9. MVP 范围

说明：

产品迭代范围可以后续动态调整，但当前 PRD 以“可进入 Codex 开发”的完整产品特性为准。

## 9.1 Included

第一阶段需要实现：

### 数据同步

* Intervals.icu API 同步
* Activities
* Workouts
* TSS
* CTL
* ATL
* Form
* FTP
* eFTP
* HR
* Pace
* Power
* Duration
* Distance
* Sport Type

### Athlete Model

构建数字运动员模型，包括：

* Fitness Profile
* Fatigue Profile
* Recovery Profile
* Training Risk Profile
* Goal Profile
* Behavior Profile

### Training Capacity Engine

每日生成 Training Capacity。

### Training Risk Engine

生成内部 risk_score 和用户侧 Training Risk Level。

### Cold Start Strategy

根据用户数据量确定建议可信度和可用功能。

### Daily Training Decision Engine

生成今日训练建议。

### Dynamic Adjustment Engine

根据用户反馈动态调整今日训练。

### Explainable Decision Engine

为每条训练建议生成可解释原因。

### Today 页面

替代 Dashboard，作为产品首页。

### Weekly Review

生成每周训练总结。

### AI Coach

只负责解释、总结、反馈、鼓励和问答。

## 9.2 Excluded

第一阶段不做：

* 社交功能
* 排行榜
* 聊天社区
* 视频课程
* Marketplace
* AI 无限自由聊天
* 医学诊断
* 伤病治疗建议
* 完整年度规划自动化
* 复杂多赛事赛季规划
* 多人教练后台

---

# 10. 核心用户旅程

## 10.1 首次使用

```text
用户登录
↓
连接 Intervals.icu
↓
同步历史训练数据
↓
系统判断数据充足度
↓
建立初始 Athlete Model
↓
生成 Training Capacity
↓
生成今日建议
↓
展示 Today 页面
```

## 10.2 每日使用

```text
用户打开 Today
↓
查看 Training Capacity
↓
查看今日训练建议
↓
查看简洁解释
↓
用户选择：
- 按计划训练
- 太累了
- 没时间
- 腿部不适
- 换成骑行
- 今天休息
↓
系统动态调整建议
↓
用户完成训练
↓
同步训练结果
↓
模型更新
```

## 10.3 每周复盘

```text
每周结束
↓
系统汇总训练完成率
↓
分析负荷变化
↓
分析恢复趋势
↓
分析训练风险
↓
生成下周建议
↓
AI Coach 输出用户友好总结
```

---

# 11. 数据充足度与冷启动策略

## 11.1 为什么需要冷启动策略

系统依赖历史训练数据进行判断。

但新用户可能只有：

* 0 天数据
* 7 天数据
* 14 天数据
* 30 天数据
* 90 天数据

如果历史数据不足，系统不能输出过度精确的建议。

## 11.2 Data Availability Level

系统根据可用训练历史生成 data_level。

| 等级 | 数据条件      | 可用能力                            | 产品文案                 |
| -- | --------- | ------------------------------- | -------------------- |
| D  | <14 天训练数据 | 只做保守建议，不做强预测                    | 正在建立你的训练基线           |
| C  | 14-41 天数据 | 基础 Training Capacity、基础训练建议     | 当前建议为基础版，准确度会随数据增加提升 |
| B  | 42-89 天数据 | 较可靠 Training Capacity、负荷趋势、训练风险 | 已具备较稳定判断能力           |
| A  | ≥90 天数据   | 完整 Capacity、风险评估、目标分析、预测能力      | 数据较充分，建议可信度较高        |

## 11.3 冷启动默认规则

### Data Level D：少于 14 天

系统行为：

* 不生成激进训练建议
* 不安排 VO2Max、Threshold、长距离高负荷训练
* 只生成 Easy、Recovery、Moderate Light 类型建议
* 不展示 goal_probability
* 不展示 performance prediction
* 不输出“高置信度”结论

用户文案：

```text
我们正在建立你的训练基线。
当前建议会偏保守，随着训练数据积累，系统会更了解你的能力和恢复规律。
```

### Data Level C：14-41 天

系统行为：

* 可生成基础 Training Capacity
* 可生成今日训练建议
* 可使用近期负荷趋势
* ACWR 和 Monotony 置信度为 medium 或 low
* 不做强目标预测

用户文案：

```text
当前已有部分训练数据，系统可以提供基础训练建议。
由于长期趋势数据仍不足，建议会保持适度保守。
```

### Data Level B：42-89 天

系统行为：

* Training Capacity 可作为主要建议依据
* 可判断负荷变化
* 可生成较可靠训练风险等级
* 可给目标进度提示
* Performance Prediction 标记为 beta

### Data Level A：90 天以上

系统行为：

* 完整启用 Training Capacity
* 完整启用 Training Risk
* 可启用 Goal Feasibility
* 可启用 Performance Prediction
* 可生成更高置信度解释

## 11.4 数据质量字段

所有核心指标必须带 data_quality 和 confidence。

示例：

```json
{
  "metric": "acwr",
  "value": 1.32,
  "data_quality": "medium",
  "confidence": 0.68,
  "reason": "only_35_days_history_available"
}
```

data_quality 枚举：

```text
high
medium
low
insufficient
```

confidence 范围：

```text
0 - 1
```

---

# 12. Athlete Model

## 12.1 核心结构

```json
{
  "athlete_id": "user_123",
  "date": "2026-06-14",
  "data_level": "B",
  "data_quality": {
    "overall": "medium",
    "history_days": 56,
    "activity_count": 42,
    "missing_sleep_days_14d": 3,
    "missing_hrv_days_14d": 5
  },
  "fitness_profile": {
    "ctl": 62,
    "ftp": 245,
    "threshold_pace": "4:55/km",
    "vo2max": 52
  },
  "fatigue_profile": {
    "atl": 71,
    "form": -9,
    "weekly_tss": 430
  },
  "recovery_profile": {
    "sleep_score": 83,
    "hrv_score": 78,
    "subjective_fatigue": 3,
    "recovery_trend": "stable"
  },
  "risk_profile": {
    "acwr": 1.12,
    "monotony": 1.7,
    "strain": 730,
    "intensity_density": 0.22,
    "training_risk_score": 0.21,
    "training_risk_level": "low"
  },
  "behavior_profile": {
    "adherence": 0.89,
    "completed_sessions_14d": 8,
    "planned_sessions_14d": 9,
    "preferred_sports": ["running", "cycling"],
    "available_days": 5
  },
  "goal_profile": {
    "primary_goal": "half_marathon",
    "goal_date": "2026-11-15",
    "goal_time": "01:40:00",
    "phase": "build"
  },
  "training_capacity": {
    "score": 76,
    "status": "Train Normally",
    "confidence": 0.82
  }
}
```

---

# 13. Training Capacity Engine

## 13.1 定义

Training Capacity 是今日训练建议的核心输入。

它代表：

> 用户今天能够承受训练刺激的综合能力。

## 13.2 输入因素

Training Capacity 由以下维度计算：

| 维度                       |  权重 | 说明                |
| ------------------------ | --: | ----------------- |
| Sleep Score              | 20% | 睡眠恢复              |
| HRV Score                | 10% | 自主神经恢复状态          |
| Form Score               | 15% | CTL 与 ATL 形成的训练平衡 |
| ACWR Score               | 10% | 近期负荷增长风险          |
| Monotony Score           | 10% | 训练重复性与单调性         |
| Adherence Score          | 15% | 训练执行能力            |
| Subjective Fatigue Score | 10% | 主观疲劳              |
| Recovery Trend Score     | 10% | 近期恢复趋势            |

计算：

```text
training_capacity = Σ(weight × normalized_score)
```

## 13.3 Readiness 的处理

Readiness 不再作为对用户展示的主指标。

系统内部可计算：

```text
readiness_subscore = weighted_sum(sleep_score, hrv_score, subjective_fatigue, recovery_trend)
```

Readiness 只用于 Training Capacity 的内部计算与解释，不在 Today 首页并列展示。

## 13.4 用户展示等级

| 分数     | 状态                | 推荐训练      |
| ------ | ----------------- | --------- |
| 81-100 | Ready To Push     | 可以安排高质量训练 |
| 61-80  | Train Normally    | 适合正常训练    |
| 41-60  | Reduce Intensity  | 降低强度      |
| <40    | Recovery Required | 恢复优先      |

## 13.5 输出 Schema

```json
{
  "date": "2026-06-14",
  "training_capacity": 76,
  "capacity_status": "Train Normally",
  "confidence": 0.82,
  "data_quality": "medium",
  "subscores": {
    "sleep": 83,
    "hrv": 78,
    "form": 72,
    "acwr": 80,
    "monotony": 65,
    "adherence": 89,
    "subjective_fatigue": 75,
    "recovery_trend": 78
  },
  "summary": "今天状态稳定，适合正常训练。"
}
```

---

# 14. Training Risk Engine

## 14.1 命名规则

内部字段可以叫：

```text
training_risk_score
```

不建议再使用面向用户的 injury_risk 命名。

用户侧统一展示：

```text
Training Risk
训练风险
```

## 14.2 输入因素

| 因素                     |  权重 |
| ---------------------- | --: |
| ACWR Risk              | 35% |
| Monotony Risk          | 20% |
| Form Risk              | 20% |
| Strain Risk            | 15% |
| Intensity Density Risk | 10% |

计算：

```text
training_risk_score =
0.35 × acwr_risk
+ 0.20 × monotony_risk
+ 0.20 × form_risk
+ 0.15 × strain_risk
+ 0.10 × density_risk
```

## 14.3 用户展示等级

| score     | level        | 用户文案           |
| --------- | ------------ | -------------- |
| <0.25     | low          | 训练风险较低         |
| 0.25-0.50 | moderate     | 训练风险略有上升       |
| 0.50-0.75 | elevated     | 训练风险偏高，建议避免高强度 |
| >0.75     | high_caution | 训练风险较高，建议恢复优先  |

## 14.4 输出 Schema

```json
{
  "training_risk_score": 0.42,
  "training_risk_level": "moderate",
  "user_label": "训练风险略有上升",
  "confidence": 0.76,
  "data_quality": "medium",
  "main_factors": [
    {
      "factor": "acwr",
      "value": 1.38,
      "message": "近期训练负荷增长偏快"
    },
    {
      "factor": "monotony",
      "value": 1.9,
      "message": "最近一周训练重复性较高"
    }
  ],
  "safe_recommendation": "建议今天避免高强度训练，优先安排轻松训练或恢复训练。"
}
```

---

# 15. ACWR Engine

## 15.1 定义

ACWR = Acute Chronic Workload Ratio

```text
acute_load = 最近 7 天总 TSS
chronic_load = 最近 28 天平均每周 TSS
ACWR = acute_load / (chronic_load)
```

也可以使用：

```text
acute_load / (28天总TSS / 4)
```

## 15.2 风险分级

| ACWR    | 解释        |
| ------- | --------- |
| <0.8    | Underload |
| 0.8-1.3 | Optimal   |
| 1.3-1.5 | Elevated  |
| >1.5    | High Risk |

## 15.3 边界情况处理

### 情况 1：历史不足 28 天

处理：

* data_quality = low 或 insufficient
* confidence 降低
* 不作为强拦截依据
* 可用 14 天简化趋势辅助判断
* 用户侧提示数据不足

### 情况 2：chronic_load = 0

处理：

* 不计算 ACWR
* acwr = null
* acwr_risk 不进入风险模型
* 使用 fallback risk calculation
* data_quality = insufficient

禁止：

```text
除以 0
输出 Infinity
输出极端结论
```

### 情况 3：近期训练突然恢复

例如用户之前几乎没训练，最近 7 天开始训练。

处理：

* ACWR 可能异常偏高
* 系统应判断为“数据基线不足 + 负荷增长偏快”
* 建议保守增长
* 不要直接输出“高受伤概率”

## 15.4 输出 Schema

```json
{
  "acwr": 1.32,
  "risk_level": "elevated",
  "data_quality": "medium",
  "confidence": 0.71,
  "acute_load_7d": 320,
  "chronic_load_28d_weekly_avg": 242,
  "message": "近期训练负荷增长偏快，建议避免继续增加高强度训练。"
}
```

---

# 16. Monotony Engine

## 16.1 定义

Monotony 用于识别训练是否过于重复。

```text
monotony = mean_daily_load / std_daily_load
```

窗口：

```text
最近 7 天
```

## 16.2 风险等级

| Monotony | 风险      |
| -------- | ------- |
| <1.5     | Healthy |
| 1.5-2.0  | Warning |
| 2.0-2.5  | High    |
| >2.5     | Severe  |

## 16.3 边界情况处理

### 情况 1：最近 7 天训练天数少于 3 天

处理：

* monotony = null
* data_quality = insufficient
* 不作为强规则依据
* 用户侧不展示该指标

### 情况 2：std_daily_load = 0

如果 7 天每日负荷完全一样，std = 0。

处理：

* monotony 不输出 Infinity
* monotony_capped = 3.0
* risk_level = severe
* message = 最近训练负荷高度重复，建议增加轻重变化

### 情况 3：大量休息日导致均值低

如果训练少且休息多，Monotony 可能不稳定。

处理：

* 结合 weekly_tss 判断
* 如果 weekly_tss 很低，则不应判断为高训练风险
* 输出“数据不足”或“训练量偏低”而非“风险严重”

## 16.4 输出 Schema

```json
{
  "monotony": 1.8,
  "risk_level": "warning",
  "data_quality": "medium",
  "confidence": 0.74,
  "mean_daily_load": 61.4,
  "std_daily_load": 34.1,
  "message": "最近一周训练重复性略高，建议安排轻重变化。"
}
```

---

# 17. Hard Safety Rules

Hard Safety Rules 拥有最高优先级。

任何训练建议都不能绕过。

## Rule 1：Training Capacity Protection

条件：

```text
training_capacity < 40
```

强制：

```text
Recovery Day 或 Rest Day
```

禁止：

* Interval
* VO2Max
* Threshold
* Long Hard Session

## Rule 2：Extreme Fatigue Protection

条件：

```text
form < -25
```

禁止：

* Interval
* VO2Max
* Threshold
* High Intensity

建议：

* Recovery Run
* Recovery Ride
* Rest Day
* Mobility

## Rule 3：ACWR Protection

条件：

```text
acwr > 1.5
且 data_quality != insufficient
```

禁止：

* High Intensity
* 继续增加周负荷

建议：

* Easy Day
* Recovery Day
* 降低未来 3-5 天负荷

## Rule 4：Training Risk Protection

条件：

```text
training_risk_score > 0.75
```

强制：

```text
Recovery Protocol
```

用户文案：

```text
近期训练风险较高，建议恢复优先，避免高强度训练。
```

## Rule 5：Intensity Density Protection

条件：

```text
连续 3 天高强度
```

自动：

```text
Easy Day
```

## Rule 6：Rest Day Protection

条件：

```text
连续 7 天训练
```

自动：

```text
Rest Day
```

## Rule 7：Sleep Protection

条件：

```text
连续 3 天 sleep_score < 60
```

禁止：

* High Intensity

## Rule 8：HRV Protection

条件：

```text
连续 3 天 HRV 下降超过 15%
```

进入：

```text
Recovery Mode
```

---

# 18. Daily Training Decision Engine

## 18.1 输入

```json
{
  "training_capacity": 76,
  "capacity_status": "Train Normally",
  "training_risk_score": 0.21,
  "training_risk_level": "low",
  "goal_phase": "build",
  "data_level": "B",
  "available_time_minutes": 60,
  "preferred_sport": "running",
  "recent_sessions": [],
  "hard_safety_flags": [],
  "user_feedback_today": null
}
```

## 18.2 决策步骤

### Step 1：检查 Hard Safety Rules

如果触发强规则，直接进入保护逻辑。

例如：

```text
capacity < 40 → Recovery Day
form < -25 → 禁止高强度
acwr > 1.5 → 禁止高强度
连续 7 天训练 → Rest Day
```

### Step 2：根据 Training Capacity 判断 Day Type

| Capacity | Day Type |
| -------- | -------- |
| >80      | Hard     |
| 60-80    | Moderate |
| 40-60    | Easy     |
| <40      | Recovery |

### Step 3：应用 Training Risk Modifier

| Risk Level   | 调整                |
| ------------ | ----------------- |
| low          | 不调整               |
| moderate     | 避免过高负荷            |
| elevated     | No High Intensity |
| high_caution | Recovery Day      |

### Step 4：应用 Goal Phase

训练阶段：

* Base
* Build
* Peak
* Taper
* Recovery

不同阶段决定训练类型优先级。

### Step 5：应用用户可用时间

例如：

* 只有 30 分钟 → 缩短训练
* 只有室内条件 → 改为室内骑行或核心
* 不能跑步 → 改为骑行或恢复训练

### Step 6：生成 Workout Recommendation

输出：

* day_type
* workout_type
* sport
* duration
* expected_tss
* intensity
* reason
* alternatives

## 18.3 输出 Schema

```json
{
  "date": "2026-06-14",
  "day_type": "moderate",
  "recommendation": {
    "sport": "running",
    "type": "tempo_run",
    "title": "节奏跑",
    "duration_minutes": 50,
    "expected_tss": 65,
    "intensity": "moderate",
    "structure": {
      "warmup": "10min easy",
      "main_set": "20min threshold effort",
      "cooldown": "10min easy"
    }
  },
  "capacity": {
    "score": 76,
    "status": "Train Normally"
  },
  "training_risk": {
    "level": "low",
    "label": "训练风险较低"
  },
  "decision": {
    "confidence": 0.89,
    "evidence": [
      "training_capacity=76",
      "form=-8",
      "acwr=1.10",
      "sleep_score=84"
    ],
    "user_friendly_reason": "今天整体状态稳定，近期负荷变化正常，适合安排一次中等强度训练。",
    "technical_reason": "Training Capacity 76, Form -8, ACWR 1.10, Sleep 84. No hard safety rule triggered."
  },
  "alternatives": [
    {
      "label": "我今天很累",
      "action": "reduce_intensity"
    },
    {
      "label": "我只有30分钟",
      "action": "shorten_workout"
    },
    {
      "label": "换成骑行",
      "action": "change_sport_to_cycling"
    }
  ]
}
```

---

# 19. Dynamic Adjustment Engine

## 19.1 目的

每日建议必须支持用户反馈。

系统不能只生成一个静态训练计划。

用户需要可以告诉系统：

* 我很累
* 我没时间
* 我腿不舒服
* 我今天只能室内
* 我想换成骑行
* 我今天想休息
* 我已完成
* 我跳过了
* 我做多了
* 我做少了

系统根据反馈重新调整今日训练建议。

## 19.2 用户反馈入口

Today 页面展示：

```text
今天情况有变化？
[太累了] [只有30分钟] [腿部不适] [换成骑行] [今天休息] [已完成]
```

## 19.3 反馈类型

```json
{
  "feedback_type": "too_tired",
  "subjective_fatigue": 8,
  "pain": false,
  "available_time_minutes": 30,
  "preferred_sport": "cycling",
  "note": "昨晚睡得不好"
}
```

feedback_type 枚举：

```text
too_tired
not_enough_time
pain_or_discomfort
prefer_easy
change_sport
indoor_only
skip_today
completed_as_planned
completed_modified
completed_more
completed_less
illness
travel
stress_high
```

## 19.4 调整规则

| 用户反馈     | 系统动作             |
| -------- | ---------------- |
| 太累了      | 降低强度一级           |
| 只有 30 分钟 | 缩短时长，保留训练目的      |
| 腿部不适     | 禁止跑步高强度，建议恢复或休息  |
| 换成骑行     | 在安全范围内转换为等效骑行训练  |
| 今天休息     | 记录跳过原因，重排本周计划    |
| 已完成      | 更新 adherence 和模型 |
| 做多了      | 更新负荷，检查后续风险      |
| 做少了      | 更新执行率，后续适度调整     |

## 19.5 调整示例

原建议：

```json
{
  "type": "interval_run",
  "duration": 60,
  "expected_tss": 85
}
```

用户反馈：

```text
我今天很累
```

调整后：

```json
{
  "type": "easy_run",
  "duration": 40,
  "expected_tss": 35,
  "reason": "你反馈今天疲劳较高，因此将原本高强度间歇调整为轻松跑。"
}
```

用户反馈：

```text
我只有 30 分钟
```

调整后：

```json
{
  "type": "short_tempo",
  "duration": 30,
  "expected_tss": 40,
  "reason": "保留本次训练的节奏刺激，但压缩训练时间。"
}
```

---

# 20. Today 页面

## 20.1 页面定位

原 Dashboard 改为 Today。

Today 是 AthleteOS 首页。

它不应是复杂数据看板，而是每日训练决策页。

核心目标：

> 用户打开后立即知道今天该怎么练。

## 20.2 页面信息架构

### 第一屏

```text
Today
Sunday, Jun 14

Training Capacity 76
Train Normally

今日建议：
节奏跑 50 分钟
预计负荷 TSS 65

一句话解释：
今天状态稳定，适合安排一次中等强度训练。
```

### 第二屏

```text
为什么这样安排？
- 睡眠恢复较好
- 近期训练负荷稳定
- 当前疲劳处于可接受范围
```

### 第三屏

```text
今天情况有变化？
[太累了] [只有30分钟] [腿部不适] [换成骑行] [今天休息]
```

### 第四屏

```text
专业详情
- Form: -8
- ACWR: 1.10
- Monotony: 1.7
- Training Risk: Low
- Confidence: 89%
```

专业详情默认折叠。

## 20.3 Today 页面组件

### 组件 1：Capacity Hero Card

字段：

* training_capacity
* capacity_status
* confidence
* data_quality
* trend_vs_yesterday

示例：

```text
Training Capacity
76
Train Normally
比昨天 +4
```

### 组件 2：Workout Recommendation Card

字段：

* workout title
* sport
* type
* duration
* expected_tss
* intensity
* structure

### 组件 3：Simple Explanation Card

用户友好解释，不超过 3 条。

示例：

```text
为什么今天这样练？
1. 昨晚睡眠恢复不错
2. 近期训练负荷稳定
3. 当前疲劳没有明显超标
```

### 组件 4：Feedback Action Bar

按钮：

* 太累了
* 只有 30 分钟
* 腿部不适
* 换成骑行
* 今天休息
* 已完成

### 组件 5：Technical Detail Drawer

默认折叠。

展开后展示：

* CTL
* ATL
* Form
* ACWR
* Monotony
* Strain
* Sleep
* HRV
* Training Risk
* Decision Confidence
* Data Quality

---

# 21. 解释系统

## 21.1 解释分层

解释必须分为两层：

### 用户友好版

面向普通用户。

特点：

* 不堆指标
* 不超过 3 条原因
* 使用自然语言
* 强调行动建议

示例：

```text
今天建议节奏跑，因为你恢复状态不错，近期训练负荷稳定，适合安排一次中等强度刺激。
```

### 专业详情版

面向数据驱动用户。

特点：

* 展示关键指标
* 展示置信度
* 展示触发规则
* 展示数据质量

示例：

```text
Training Capacity 76
Form -8
ACWR 1.10
Monotony 1.7
Sleep Score 84
Decision Confidence 89%
No hard safety rule triggered.
```

## 21.2 AI Coach 的作用

AI Coach 读取：

```json
{
  "state": {},
  "decision": {},
  "evidence": {},
  "prediction": {}
}
```

AI Coach 允许：

* Explain
* Educate
* Summarize
* Motivate
* Q&A

AI Coach 禁止：

* Direct Load Decision
* Risk Override
* Goal Override
* Safety Override
* Medical Diagnosis

## 21.3 AI 输出约束

AI Coach 不得输出：

```text
你必须进行高强度训练
你受伤概率为 80%
忽略系统建议继续训练
你可以带伤完成间歇跑
```

AI Coach 应输出：

```text
根据当前训练状态，系统建议降低强度。
如果你已经有明显疼痛，建议优先休息，必要时咨询专业人士。
```

---

# 22. Weekly Review

## 22.1 目的

每周自动总结用户训练情况，帮助用户理解：

* 本周练得怎么样
* 是否完成计划
* 负荷是否增长过快
* 恢复是否充足
* 下周建议怎么调整

## 22.2 输入

* planned_sessions
* completed_sessions
* weekly_tss
* running_load
* cycling_load
* strength_sessions
* sleep_trend
* hrv_trend
* form_trend
* acwr
* monotony
* user_feedback
* skipped_sessions

## 22.3 输出结构

```json
{
  "week_start": "2026-06-08",
  "week_end": "2026-06-14",
  "summary": "本周训练完成度较好，负荷增长稳定。",
  "adherence": 0.86,
  "weekly_tss": 430,
  "load_change_vs_last_week": 0.06,
  "training_risk_level": "moderate",
  "highlights": [
    "完成 6 次训练中的 5 次",
    "周负荷较上周增长 6%",
    "睡眠趋势稳定"
  ],
  "warnings": [
    "周末连续两天强度偏高，下周初建议恢复"
  ],
  "next_week_recommendation": "下周可以维持当前训练量，但建议控制高强度次数。"
}
```

## 22.4 用户文案示例

```text
本周你完成了 6 次计划中的 5 次，训练完成率为 83%。

整体负荷较上周增长 6%，处于合理范围。周末连续两天强度偏高，因此建议下周一安排恢复训练，避免疲劳继续累积。
```

---

# 23. Goal Planning 与 Goal Feasibility

## 23.1 目标

Goal Planning 不作为第一屏核心，但作为长期能力模块存在。

用户输入：

* 目标赛事
* 日期
* 目标成绩
* 当前能力
* 每周可训练天数
* 偏好项目

系统输出：

* 当前目标进度
* 目标可行性等级
* 所需提升
* 预期提升
* A/B/C 目标建议

## 23.2 冷启动限制

如果 data_level < B：

* 不展示强 goal_probability
* 不输出精确达成概率
* 只展示“目标分析需要更多数据”

用户文案：

```text
当前历史数据还不足以可靠评估目标达成概率。系统会继续积累训练数据，并在数据更充分后给出目标可行性分析。
```

## 23.3 输出 Schema

```json
{
  "goal_probability": 0.71,
  "goal_grade": "B",
  "required_improvement_seconds": 420,
  "expected_improvement_seconds": 300,
  "confidence": 0.72,
  "data_quality": "medium",
  "goal_options": {
    "goal_a": "01:40:00",
    "goal_b": "01:43:00",
    "goal_c": "01:46:00"
  }
}
```

---

# 24. 数据模型设计

## 24.1 users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
```

## 24.2 athlete_profiles

```sql
CREATE TABLE athlete_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  primary_sport TEXT,
  timezone TEXT,
  birth_year INT,
  sex TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
```

## 24.3 connected_accounts

```sql
CREATE TABLE connected_accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  provider TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  provider_user_id TEXT,
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
```

## 24.4 activities

```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  provider_activity_id TEXT,
  sport TEXT,
  start_time TIMESTAMP,
  duration_seconds INT,
  distance_meters NUMERIC,
  tss NUMERIC,
  intensity_factor NUMERIC,
  avg_hr NUMERIC,
  max_hr NUMERIC,
  avg_power NUMERIC,
  normalized_power NUMERIC,
  avg_pace NUMERIC,
  elevation_gain NUMERIC,
  raw_data JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
```

## 24.5 daily_athlete_states

```sql
CREATE TABLE daily_athlete_states (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  data_level TEXT,
  data_quality JSONB,
  fitness NUMERIC,
  fatigue NUMERIC,
  form NUMERIC,
  sleep_score NUMERIC,
  hrv_score NUMERIC,
  acwr NUMERIC,
  monotony NUMERIC,
  strain NUMERIC,
  adherence NUMERIC,
  subjective_fatigue NUMERIC,
  training_capacity NUMERIC,
  capacity_status TEXT,
  training_risk_score NUMERIC,
  training_risk_level TEXT,
  confidence NUMERIC,
  state_json JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);
```

## 24.6 daily_recommendations

```sql
CREATE TABLE daily_recommendations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  day_type TEXT,
  sport TEXT,
  workout_type TEXT,
  title TEXT,
  duration_minutes INT,
  expected_tss NUMERIC,
  intensity TEXT,
  workout_structure JSONB,
  decision_json JSONB,
  user_friendly_reason TEXT,
  technical_reason TEXT,
  confidence NUMERIC,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
```

## 24.7 user_feedback

```sql
CREATE TABLE user_feedback (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  recommendation_id UUID REFERENCES daily_recommendations(id),
  feedback_type TEXT NOT NULL,
  subjective_fatigue INT,
  pain BOOLEAN,
  pain_area TEXT,
  available_time_minutes INT,
  preferred_sport TEXT,
  note TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
```

## 24.8 weekly_reviews

```sql
CREATE TABLE weekly_reviews (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  week_start DATE,
  week_end DATE,
  adherence NUMERIC,
  weekly_tss NUMERIC,
  load_change NUMERIC,
  training_risk_level TEXT,
  summary TEXT,
  highlights JSONB,
  warnings JSONB,
  next_week_recommendation TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
```

---

# 25. API 设计

## 25.1 获取 Today 页面

```http
GET /api/today
```

Response：

```json
{
  "date": "2026-06-14",
  "training_capacity": {
    "score": 76,
    "status": "Train Normally",
    "confidence": 0.82,
    "data_quality": "medium"
  },
  "training_risk": {
    "level": "low",
    "label": "训练风险较低"
  },
  "recommendation": {
    "id": "rec_123",
    "sport": "running",
    "type": "tempo_run",
    "title": "节奏跑",
    "duration_minutes": 50,
    "expected_tss": 65,
    "intensity": "moderate",
    "structure": {
      "warmup": "10min easy",
      "main_set": "20min threshold effort",
      "cooldown": "10min easy"
    }
  },
  "explanation": {
    "simple": "今天状态稳定，适合安排一次中等强度训练。",
    "reasons": [
      "睡眠恢复较好",
      "近期训练负荷稳定",
      "当前疲劳处于可接受范围"
    ],
    "technical": {
      "form": -8,
      "acwr": 1.1,
      "monotony": 1.7,
      "sleep_score": 84,
      "confidence": 0.89
    }
  },
  "feedback_options": [
    "too_tired",
    "not_enough_time",
    "pain_or_discomfort",
    "change_sport",
    "skip_today",
    "completed_as_planned"
  ]
}
```

## 25.2 提交用户反馈

```http
POST /api/today/feedback
```

Request：

```json
{
  "recommendation_id": "rec_123",
  "feedback_type": "too_tired",
  "subjective_fatigue": 8,
  "pain": false,
  "available_time_minutes": 40,
  "note": "昨晚睡得不好"
}
```

Response：

```json
{
  "adjusted": true,
  "new_recommendation": {
    "sport": "running",
    "type": "easy_run",
    "title": "轻松跑",
    "duration_minutes": 40,
    "expected_tss": 35,
    "intensity": "easy"
  },
  "reason": "你反馈今天疲劳较高，因此将原本节奏跑调整为轻松跑。"
}
```

## 25.3 获取每日状态详情

```http
GET /api/state/daily?date=2026-06-14
```

## 25.4 获取周报

```http
GET /api/weekly-review/latest
```

## 25.5 同步 Intervals.icu

```http
POST /api/sync/intervals
```

---

# 26. 前端页面需求

## 26.1 页面列表

第一阶段页面：

* `/today`
* `/history`
* `/weekly-review`
* `/settings`
* `/connect/intervals`
* `/goals`
* `/debug/state`，仅开发环境

## 26.2 Today 页面布局

建议使用卡片式布局。

### 页面顶部

```text
Today
Sunday, Jun 14
```

### Capacity Card

```text
Training Capacity
76
Train Normally
```

### Recommendation Card

```text
今日建议
节奏跑
50 min
Expected TSS 65
```

### Explanation Card

```text
为什么这样练？
- 睡眠恢复较好
- 近期训练负荷稳定
- 当前疲劳可控
```

### Feedback Buttons

```text
今天情况有变化？
[太累了]
[只有30分钟]
[腿部不适]
[换成骑行]
[今天休息]
[已完成]
```

### Technical Drawer

```text
专业详情
Form -8
ACWR 1.10
Monotony 1.7
Training Risk Low
Confidence 89%
```

---

# 27. 后端服务模块

建议后端拆分为以下模块：

```text
app/
  main.py
  api/
    today.py
    sync.py
    feedback.py
    weekly_review.py
    goals.py
  services/
    intervals_client.py
    state_builder.py
    capacity_engine.py
    risk_engine.py
    decision_engine.py
    adjustment_engine.py
    explanation_engine.py
    weekly_review_engine.py
    ai_coach.py
  models/
    user.py
    activity.py
    daily_state.py
    recommendation.py
    feedback.py
  schemas/
    today.py
    state.py
    recommendation.py
    feedback.py
  jobs/
    sync_intervals.py
    build_daily_state.py
    generate_weekly_review.py
```

---

# 28. Engine 执行流程

每日定时任务：

```text
1. Sync Intervals.icu activities
2. Build Athlete Model
3. Calculate Data Level
4. Calculate Data Quality
5. Calculate Fitness / Fatigue / Form
6. Calculate Sleep / HRV / Subjective Fatigue
7. Calculate ACWR with edge handling
8. Calculate Monotony with edge handling
9. Calculate Training Risk
10. Calculate Training Capacity
11. Apply Hard Safety Rules
12. Generate Daily Recommendation
13. Generate Explanation
14. Save Daily State and Recommendation
```

---

# 29. 置信度设计

每个建议必须有 confidence。

## 29.1 影响因素

* 历史数据天数
* 活动数量
* 睡眠数据完整性
* HRV 数据完整性
* 最近同步时间
* 用户反馈完整性
* 指标边界异常情况

## 29.2 confidence 计算示例

```text
confidence =
data_completeness_score
× history_length_score
× wearable_data_score
× metric_stability_score
```

## 29.3 用户文案

| confidence | 文案          |
| ---------- | ----------- |
| >0.8       | 建议可信度较高     |
| 0.6-0.8    | 建议可信度中等     |
| 0.4-0.6    | 建议仅供参考      |
| <0.4       | 数据不足，建议保守处理 |

---

# 30. 成功指标

## 30.1 产品指标

* DAU
* WAU
* Weekly Retention
* Training Recommendation Open Rate
* Feedback Submission Rate
* Plan Adherence
* Completed Sessions
* Adjusted Recommendation Usage Rate
* Weekly Review Read Rate

## 30.2 训练相关指标

* Training Completion Rate
* Plan Adherence
* Missed Session Recovery Rate
* High Risk Warning Count
* High Risk Override Count
* Training Capacity Trend
* User Feedback Fatigue Trend

## 30.3 AI 解释指标

* Explanation Open Rate
* Technical Detail Open Rate
* User Question Rate
* User Satisfaction Feedback

---

# 31. 验收标准

## 31.1 Today 页面

用户打开 Today 页面后，必须看到：

* Training Capacity
* Capacity Status
* 今日训练建议
* 训练时长
* 预计 TSS
* 简洁解释
* 用户反馈入口

## 31.2 Training Capacity

系统必须：

* 每日生成 Training Capacity
* 输出 0-100 分
* 输出 capacity_status
* 输出 confidence
* 输出 data_quality
* 不再把 Readiness 作为首页主指标

## 31.3 Training Risk

系统必须：

* 内部计算 training_risk_score
* 用户侧展示 Training Risk Level
* 不使用“受伤概率 xx%”表达
* 高风险时自动降低训练建议

## 31.4 冷启动

系统必须：

* 根据历史数据判断 data_level
* 数据不足时降低建议置信度
* 数据不足时禁止强预测
* 数据不足时输出保守建议文案

## 31.5 ACWR / Monotony

系统必须：

* 处理 chronic_load = 0
* 处理 std_daily_load = 0
* 处理历史数据不足
* 输出 data_quality
* 输出 confidence
* 不输出 Infinity / NaN

## 31.6 用户反馈

系统必须支持：

* 太累了
* 只有 30 分钟
* 腿部不适
* 换成骑行
* 今天休息
* 已完成

提交反馈后，系统必须：

* 记录反馈
* 必要时生成调整后的训练建议
* 说明调整原因

## 31.7 AI Coach

AI Coach 必须：

* 只能解释已有决策
* 不能覆盖安全规则
* 不能自行决定训练负荷
* 不能输出医学诊断
* 不能鼓励用户带伤高强度训练

---

# 32. 安全与免责声明

产品必须展示基础免责声明：

```text
AthleteOS 提供训练建议和数据分析，不构成医疗建议。
如果你有明显疼痛、伤病、胸闷、头晕或其他异常症状，请停止训练并咨询专业人士。
```

当用户反馈 pain_or_discomfort 时，系统必须优先建议降低训练或休息。

---

# 33. 开发优先级建议

## Phase 1：核心闭环

* Intervals.icu Sync
* Daily State Builder
* Training Capacity Engine
* Training Risk Engine
* Daily Recommendation Engine
* Today 页面
* 用户反馈调整
* 简单解释

## Phase 2：周报与目标

* Weekly Review
* Goal Setup
* Goal Progress
* A/B/C Goal
* Basic Goal Feasibility

## Phase 3：预测与高级教练

* Performance Prediction
* Adaptive Season Planning
* Multi-Sport Optimization
* Advanced AI Coach
* Digital Athlete Graph

---

# 34. Codex 开发说明

请 Codex 按以下原则开发：

1. 优先实现核心闭环，不要先做复杂图表。
2. Training Capacity 是唯一用户主指标。
3. Readiness 只能作为内部子维度。
4. 用户侧不要展示 injury probability。
5. Training Risk 使用等级和解释，不做医学判断。
6. ACWR 和 Monotony 必须处理边界情况，禁止 NaN 和 Infinity。
7. Today 页面是首页，不使用 Dashboard 命名。
8. 每日建议必须支持用户反馈和动态调整。
9. AI Coach 不得直接生成训练负荷决策。
10. 每条建议必须保存 decision_json，便于审计和回溯。

---

# 35. MVP 成功定义

当用户每天打开 AthleteOS 时，可以无需研究复杂数据，直接知道：

```text
今天该练什么
为什么这样练
如果今天状态变化，如何调整
这次训练是否安全
本周训练是否在正确方向上
```

这就是 MVP 的成功。

---

# 36. 产品长期愿景

AthleteOS 最终不是训练记录工具，而是用户的 Personal Digital Coach。

它持续维护用户的数字运动员模型，理解：

* 当前状态
* 长期目标
* 恢复能力
* 训练偏好
* 执行习惯
* 训练风险
* 表现趋势

并逐步实现：

* 自动规划
* 自动调整
* 自动解释
* 自动优化

最终帮助用户长期、稳定、可持续地进步。