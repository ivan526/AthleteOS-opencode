# Training Engine Specification

Version: 1.0

Product: AthleteOS

---

# 1. Design Principles

## Principle 1

训练负荷决策优先于 LLM。

LLM 不参与：

* 训练负荷计算
* 恢复判断
* 周期规划

LLM仅负责：

* 解释
* 总结
* 问答

---

## Principle 2

优先采用成熟运动科学模型。

包括：

* Banister Fitness-Fatigue Model
* Acute Chronic Workload Ratio (ACWR)
* Training Monotony
* Progressive Overload
* Polarized Training

---

## Principle 3

系统目标：

最大化长期适应

而不是：

最大化当天训练量

---

# 2. Athlete State Model

每日生成一次状态快照

```json
{
  "date": "2026-06-14",

  "fitness": 62,
  "fatigue": 70,
  "form": -8,

  "readiness": 78,

  "injury_risk": 0.18,

  "weekly_tss": 430,

  "running_tss": 230,
  "cycling_tss": 180,

  "monotony": 1.7,

  "goal_phase": "build"
}
```

所有训练决策基于此对象。

---

# 3. Fitness Model

来源：

Intervals.icu

直接读取：

CTL

作为 Fitness

```text
fitness = ctl
```

理由：

CTL 已经是广泛验证的长期训练能力指标。

避免重复实现。

---

# 4. Fatigue Model

来源：

Intervals.icu

直接读取：

ATL

```text
fatigue = atl
```

---

# 5. Form Model

来源：

Intervals.icu

```text
form = ctl - atl
```

即：

TSB

Training Stress Balance

---

解释：

> +15

非常新鲜

---

0 ~ +15

适合比赛

---

-10 ~ 0

正常训练

---

-20 ~ -10

重训练阶段

---

< -20

过度疲劳风险

---

# 6. Acute Chronic Workload Ratio

ACWR

目的：

发现负荷增长过快

---

计算：

acute_load

最近7天TSS

---

chronic_load

最近28天平均TSS

---

```text
ACWR

=

acute_load

/

(chronic_load / 4)
```

---

解释：

< 0.8

训练刺激不足

---

0.8 - 1.3

最佳区域

---

1.3 - 1.5

需注意

---

> 1.5

受伤风险明显升高

---

# 7. Monotony Model

目的：

发现重复性训练风险

---

最近7天：

daily_tss

例如：

```text
80
75
82
78
85
80
79
```

---

计算：

```text
monotony

=

mean(daily_tss)

/

std(daily_tss)
```

---

风险：

< 1.5

正常

---

1.5-2.0

关注

---

2.0-2.5

高风险

---

> 2.5

极高风险

---

# 8. Strain Model

来自 Foster Model

---

```text
strain

=

weekly_tss

×

monotony
```

---

解释：

同样 500 TSS

Monotony = 1.2

Strain = 600

---

Monotony = 2.5

Strain = 1250

---

第二种风险显著更高

---

# 9. Readiness Engine

输出：

0~100

---

## Sleep Component

30%

```text
sleep_score
```

标准化：

```text
0~100
```

---

## Form Component

25%

转换：

```text
form >= 10 → 100

0 → 80

-10 → 60

-20 → 30

<-25 → 10
```

---

## ACWR Component

20%

最佳区间：

0.8~1.3

给予高分

偏离逐渐扣分

---

## Monotony Component

15%

单调性越高

分数越低

---

## Subjective Fatigue

10%

用户每日输入：

1~10

转换：

```text
fatigue_score

=

100 - fatigue×10
```

---

最终：

```text
readiness

=

0.30×sleep

+

0.25×form

+

0.20×acwr

+

0.15×monotony

+

0.10×subjective
```

---

# 10. Injury Risk Engine

输出：

0~1

---

风险来源：

ACWR

40%

---

Monotony

30%

---

Form

20%

---

Recent Intensity

10%

---

公式：

```text
risk

=

0.4×acwr_risk

+

0.3×monotony_risk

+

0.2×form_risk

+

0.1×intensity_risk
```

---

等级：

<0.25

Low

---

0.25-0.5

Moderate

---

0.5-0.75

High

---

> 0.75

Critical

---

# 11. Training Decision Engine

输入：

readiness

injury_risk

goal_phase

---

第一步：

确定训练日类型

---

readiness > 80

Hard Day

---

60-80

Moderate Day

---

40-60

Easy Day

---

<40

Recovery Day

---

第二步：

风险限制

---

injury_risk > 0.75

强制 Recovery

---

injury_risk > 0.5

禁止高强度

---

# 12. Goal Planning Engine

四阶段模型

---

Base

50%

---

Build

30%

---

Peak

15%

---

Taper

5%

---

Example

16周计划

---

Base

8周

---

Build

5周

---

Peak

2周

---

Taper

1周

---

# 13. Progressive Overload Engine

目标：

避免增长过快

---

每周TSS增长：

```text
≤ 8%
```

推荐：

```text
5%
```

---

超过：

```text
12%
```

触发警告

---

# 14. Polarized Training Distribution

耐力项目默认策略

---

Zone1-2

80%

---

Zone3+

20%

---

统计窗口：

最近28天

---

偏离时：

自动调整未来计划

---

# 15. Strength Recommendation Engine

触发条件：

连续3天

无核心训练

---

自动插入：

Core Session

15分钟

---

动作：

Plank

Side Plank

Glute Bridge

Dead Bug

Bird Dog

---

# 16. Weekly Planning Algorithm

每周生成一次

---

Step1

读取目标

---

Step2

确定阶段

Base

Build

Peak

Taper

---

Step3

确定目标周TSS

---

Step4

分配：

跑步

骑行

力量

---

Step5

生成每日训练模板

---

Step6

每日动态调整

---

# 17. Hard Safety Rules

以下情况禁止高强度训练：

readiness < 40

---

form < -25

---

ACWR > 1.5

---

injury_risk > 0.75

---

连续3天高强度训练

---

连续7天无休息日

---

# 18. Engine Output

```json
{
  "training_day_type": "moderate",

  "recommended_session": {
    "type": "tempo_run",
    "duration": 50,
    "expected_tss": 65
  },

  "readiness": 78,

  "injury_risk": 0.18,

  "explanation": [
    "sleep recovered well",
    "fatigue acceptable",
    "weekly load within target"
  ]
}
```

该对象将作为前端展示和 AI Coach 解释的唯一数据源。