# Product Requirements Document (PRD)

## Product Name

AthleteOS

AI-Powered Endurance Training Coach

Version: MVP v1.0

---

# 1. Product Vision

AthleteOS 是一个面向耐力运动员的智能训练教练系统。

系统通过接入 Intervals.icu 数据，持续分析用户的训练负荷、恢复状态和长期目标，自动生成每日训练建议，并根据实际执行情况动态调整未来计划。

与传统 AI 教练不同：

AthleteOS 不依赖大模型决定训练负荷。

训练决策由运动科学模型和规则引擎完成。

AI 负责解释、分析、反馈和长期陪伴。

目标是成为：

"个人数字教练（Personal Digital Coach）"

而不是：

"另一个训练记录 App"

---

# 2. Target Users

## Primary Users

耐力运动爱好者：

* 跑步
* 骑行
* 半马
* 全马
* 铁人三项入门

训练频率：

每周 4~10 次

年龄：

25~50 岁

已有运动手表：

* Garmin
* Coros
* Apple Watch

并已同步至 Intervals.icu

---

## Secondary Users

数据驱动型运动员

特点：

* 使用 TrainingPeaks
* 使用 Intervals.icu
* 理解 TSS
* 理解 CTL/ATL/Form

希望获得：

更智能的训练规划

---

# 3. Core Problem

当前运动员面临的问题：

## 问题1

知道自己练了多少

不知道今天该练什么

---

## 问题2

能看到大量数据

但无法转化成行动

例如：

CTL = 63

Form = -12

用户不知道意味着什么

---

## 问题3

训练计划是静态的

现实状态是动态的

睡眠不好

工作压力大

感冒

出差

计划无法自动调整

---

# 4. Product Goals

## Goal 1

每日训练决策自动化

用户每天打开系统：

立即知道：

今天练什么

---

## Goal 2

降低过度训练风险

通过：

* Fatigue
* Form
* Monotony
* Recovery

综合判断

---

## Goal 3

长期目标自动拆解

例如：

2026 台北半马

目标成绩：

1:40

系统自动规划训练周期

---

# 5. MVP Scope

## Included

### 数据同步

Intervals.icu API

同步：

* Activities
* Workout
* TSS
* CTL
* ATL
* Form
* FTP
* eFTP
* HR
* Pace
* Power

---

### Athlete Model

建立用户数字运动员模型

---

### Readiness Score

每日恢复评分

---

### Daily Planning Engine

每日训练生成

---

### Weekly Review

每周总结

---

### AI Coach

训练解释

训练反馈

训练分析

---

## Excluded

第一版不做：

* 社交功能
* 排行榜
* AI聊天机器人无限对话
* 训练课程商城
* 视频教学

---

# 6. Athlete Model

核心数据结构

```json
{
  "fitness": 62,
  "fatigue": 70,
  "form": -8,

  "weekly_tss": 430,

  "running_load": 230,
  "cycling_load": 180,

  "sleep_score": 82,

  "readiness": 78,

  "injury_risk": 0.18,

  "goal": "half_marathon"
}
```

所有训练决策基于此模型。

---

# 7. Readiness Engine

评分范围：

0~100

---

计算权重：

Sleep Score 30%

Form 25%

Recent Load 20%

Monotony 15%

Subjective Fatigue 10%

---

输出：

0-40

Recovery Needed

41-60

Easy Day

61-80

Moderate Day

81-100

Hard Day

---

# 8. Training Load Engine

直接使用 Intervals.icu 数据

不重复计算 CTL/ATL。

系统负责：

解释和应用。

例如：

Form = -25

系统提示：

恢复不足

建议降低训练强度

---

# 9. Monotony Engine

目的：

发现受伤风险

计算：

Monotony =

平均每日训练负荷

/

训练负荷标准差

---

风险等级：

< 1.5

正常

1.5 - 2.0

注意

2.0 - 2.5

风险升高

> 2.5

高风险

---

# 10. Daily Planning Engine

输入：

Athlete Model

---

输出：

今日训练建议

---

Example

Readiness = 84

生成：

Tempo Run

50 min

Expected TSS = 60

Core Training

15 min

---

Readiness = 42

生成：

Recovery Ride

40 min

Mobility

10 min

---

# 11. Goal Planning Engine

用户输入：

赛事

日期

目标成绩

---

Example

赛事：

台北半马

日期：

2026-11-15

目标：

1:40

---

系统自动生成：

Base Phase

Build Phase

Peak Phase

Taper Phase

---

输出：

未来16周训练框架

---

# 12. Strength Training Module

MVP仅支持：

Core Training

---

动作库：

Plank

Side Plank

Glute Bridge

Dead Bug

Bird Dog

---

规则：

连续3天未训练核心

自动插入核心训练

---

# 13. AI Coach

职责：

解释

分析

反馈

鼓励

---

不负责：

决定训练负荷

决定是否休息

决定训练周期

---

Example

过去两周：

CTL +5

跑步负荷增长18%

骑行负荷增长8%

建议：

减少一次高强度跑步

增加恢复骑行

---

# 14. Dashboard

首页

---

今日状态卡

Readiness

Fatigue

Fitness

Injury Risk

---

今日计划

训练内容

训练时长

预计负荷

---

本周概览

Weekly TSS

Running

Cycling

Strength

---

趋势图

Fitness

Fatigue

Form

---

# 15. Weekly Review

每周自动生成

包括：

训练完成率

负荷变化

恢复情况

风险分析

下周建议

---

# 16. Technical Architecture

Frontend

Next.js

TailwindCSS

shadcn/ui

---

Backend

FastAPI

Python

---

Database

PostgreSQL

TimescaleDB

---

Data Sync

Intervals.icu API

Cron Sync

---

AI Layer

OpenAI API

---

Deployment

Railway

or

Fly.io

---

# 17. Success Metrics

Daily Active Users

Training Completion Rate

Weekly Retention

Plan Adherence

Readiness Prediction Accuracy

Injury Warning Accuracy

---

# MVP Success Definition

用户每天打开 AthleteOS

无需研究数据

即可知道：

今天该练什么

为什么这样练

未来应该如何进步

---

# 18. Product Roadmap

---

# V2 — Performance Intelligence

目标：

让用户知道：

“我距离目标还有多远”

而不仅仅是：

“今天练什么”

---

## 18.1 Performance Prediction Engine

### Overview

基于历史训练数据和训练负荷趋势预测未来表现。

---

### Supported Predictions

跑步：

* 5K
* 10K
* Half Marathon
* Marathon

骑行：

* FTP
* eFTP
* 20min Power
* Critical Power

---

### Input

最近：

* 90天训练记录
* CTL趋势
* 跑量
* 骑行量
* 高强度训练比例

---

### Output

```json
{
  "current_half_marathon": "1:47:20",

  "predicted_half_marathon": "1:42:50",

  "goal_half_marathon": "1:40:00",

  "goal_probability": 0.71
}
```

---

### User Experience

首页新增：

Performance Card

显示：

当前能力

预测能力

目标能力

完成概率

---

### Example

目标：

半马 1:40

系统显示：

当前预测：

1:42:50

完成概率：

71%

预计达成时间：

8周

---

## 18.2 Goal Gap Analysis

目的：

量化用户距离目标的差距。

---

Example

目标：

Half Marathon

1:40

---

系统分析：

当前能力：

1:47

---

差距：

7分钟

---

主要限制因素：

* Threshold Pace
* Weekly Mileage
* Running Frequency

---

生成：

Improvement Roadmap

---

# 18.3 Performance Trend Analysis

系统识别：

近期进步速度

---

例如：

过去8周

FTP：

+14W

---

预测：

未来12周

FTP：

+18W

---

显示：

Gain Velocity

Performance Momentum

---

# V2 — Workout Prescription Engine

目标：

从

“练什么”

升级到

“怎么练”

---

## 18.4 Structured Workout Generator

自动生成结构化训练。

---

跑步

Example

```json
{
  "type": "tempo_run",

  "warmup": "10min",

  "main_set": [
    {
      "duration": "20min",
      "pace": "4:55/km"
    }
  ],

  "cooldown": "10min"
}
```

---

骑行

Example

```json
{
  "type": "sweet_spot",

  "main_set": [
    {
      "duration": "3x12min",
      "power": "88%-94% FTP"
    }
  ]
}
```

---

## 18.5 Dynamic Workout Scaling

训练前重新评估状态。

---

Example

原计划：

Interval Run

TSS 80

---

Readiness下降

系统自动调整：

Tempo Run

TSS 55

---

无需用户手动修改

---

## 18.6 Recovery Recommendation Engine

自动生成恢复建议。

---

包括：

* 睡眠建议
* 恢复骑
* 恢复跑
* Mobility
* Core Session

---

输出：

Recovery Score

Recovery Plan

---

# V3 — Goal Optimization System

目标：

让系统自动规划整个赛季。

---

## 18.7 Annual Training Planner

支持：

全年赛事规划

---

Example

```json
{
  "race_1": "Spring Half Marathon",

  "race_2": "Autumn Marathon",

  "race_3": "Cycling Gran Fondo"
}
```

---

系统自动安排：

Base

Build

Peak

Taper

Off Season

---

## 18.8 Multi-Sport Optimization

支持：

跑步

骑行

力量

混合目标

---

Example

目标：

半马PB

同时保持FTP

---

系统自动分配训练资源。

---

## 18.9 Adaptive Goal Adjustment

实时判断目标是否合理。

---

Example

目标：

16周后

半马1:30

---

系统评估：

成功率仅15%

---

自动推荐：

A Goal

1:30

B Goal

1:35

C Goal

1:40

---

# V3 — Premium AI Coach

目标：

构建真正有价值的 AI 教练。

---

## 18.10 Training Insights

每日分析：

训练趋势

恢复情况

负荷变化

---

Example

过去14天：

跑步负荷增长22%

恢复能力下降12%

建议增加恢复日

---

## 18.11 Natural Language Query

用户提问：

“为什么今天不安排间歇跑？”

---

系统解释：

基于：

Readiness

ACWR

Form

Monotony

进行解释。

---

## 18.12 Weekly Coaching Report

每周自动生成：

* Performance
* Recovery
* Risk
* Goal Progress

综合分析报告。

---

# Long-Term Vision

AthleteOS 不只是训练记录工具。

而是：

Personal Digital Coach

持续维护用户的数字运动员模型。

理解：

* 当前状态
* 长期目标
* 风险水平
* 表现趋势

最终实现：

自动规划

自动调整

自动解释

帮助用户长期稳定进步。