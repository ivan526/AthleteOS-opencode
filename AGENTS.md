# AGENTS.md - AthleteOS

**项目阶段**: 全新项目，文档已就绪，待开发
**最新 PRD 版本**: v1.1 (`doc/prd-v1.1.md`)

---

## 项目概况

AthleteOS 是面向中国耐力运动用户的智能训练计划跟踪产品。

**核心原则（必须严格遵守）：**
1. ✅ 首页叫「今日训练」，不是 Dashboard
2. ✅ 首页只展示一个主指标：`training_capacity` (训练能力)
3. ✅ Readiness 只能作为内部子维度，不作为首页主指标
4. ✅ 训练风险统一叫「训练风险」，禁止展示「受伤概率 xx%」
5. ✅ AI Coach 只负责解释，不允许决定训练负荷
6. ✅ 训练建议必须来自规则引擎和运动科学指标
7. ✅ MVP 不做 V2/V3 功能（表现预测、全年规划、多项目优化、社区、排行榜、商城）

**技术栈固定**：
- Frontend: Next.js + TypeScript + TailwindCSS + shadcn/ui
- Backend: FastAPI + Python + PostgreSQL + SQLAlchemy + Alembic
- Data Source: Intervals.icu API

**设计风格**：淡绿色为主，清新、专业、克制、健康

---

## 开发优先级（按顺序）

### Phase 1: 前端 Mock 数据阶段
先用 mock 数据完成 4 个 Tab 界面：

1. **今日** (Today) - Training Capacity + 今日训练建议
2. **历史** (History) - 负荷趋势 + 指标变化
3. **复盘** (Review) - 每周总结
4. **设置** (Settings) - Intervals.icu 连接、用户信息

### Phase 2: 后端 API 开发
- Intervals.icu 数据同步
- Athlete Model 计算引擎
- Training Capacity Engine
- Training Risk Engine
- Daily Recommendation Engine

### Phase 3: 前后端联调
- 接入真实 API
- 完成端到端流程

---

## 核心数据模型

### Training Capacity Engine（首页主指标）
范围：0-100，由以下维度加权计算：

| 维度 | 权重 |
|---|---:|
| Sleep Score | 20% |
| HRV Score | 10% |
| Form Score | 15% |
| ACWR Score | 10% |
| Monotony Score | 10% |
| Adherence Score | 15% |
| Subjective Fatigue Score | 10% |
| Recovery Trend Score | 10% |

用户展示等级：
- 81-100: Ready To Push → 可以安排高质量训练
- 61-80: Train Normally → 适合正常训练
- 41-60: Reduce Intensity → 状态一般，建议降低强度
- 0-40: Recovery Required → 恢复优先，建议休息或恢复训练

### Training Risk Engine（内部计算，用户友好展示）
内部 risk_score 范围 0-1，用户侧展示等级：

| risk_score | 等级 | 用户侧文案 |
|---|---|---|
| <0.25 | Low | 训练风险较低 |
| 0.25-0.50 | Moderate | 训练风险略有上升 |
| 0.50-0.75 | Elevated | 训练风险偏高，建议避免高强度 |
| >0.75 | High Caution | 训练风险较高，建议恢复优先 |

### ACWR 边界处理（必须实现）
- 历史不足 28 天 → data_quality = low/insufficient，不作为强拦截依据
- chronic_load = 0 → 不计算 ACWR，使用 fallback risk calculation
- 近期训练突然恢复 → 判断为「数据基线不足 + 负荷增长偏快」，建议保守增长

### Monotony 边界处理（必须实现）
- 最近 7 天训练天数少于 3 天 → monotony = null
- std_daily_load = 0 → 不输出 Infinity，monotony_capped = 3.0
- 大量休息日导致均值低 → 结合 weekly_tss 判断

---

## Hard Safety Rules（最高优先级，不可绕过）

1. `training_capacity < 40` → Recovery Day 或 Rest Day，禁止高强度
2. `form < -25` → 禁止 Interval / VO2Max / Threshold / High Intensity
3. `acwr > 1.5` 且数据充足 → 禁止高强度，禁止继续增加周负荷
4. `training_risk_score > 0.75` → 强制 Recovery Protocol
5. 连续 3 天高强度 → Easy Day
6. 连续 7 天训练 → Rest Day
7. 连续 3 天 `sleep_score < 60` → 禁止高强度
8. 连续 3 天 HRV 下降超过 15% → Recovery Mode

---

## 项目目录结构建议

```
AthleteOS-opencode/
├── frontend/                    # Next.js 前端
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── today/          # 今日训练页面
│   │   │   ├── history/        # 历史数据页面
│   │   │   ├── review/         # 复盘页面
│   │   │   └── settings/       # 设置页面
│   │   └── layout.tsx
│   ├── components/
│   │   ├── training/           # 训练相关组件
│   │   ├── ui/                 # shadcn/ui 基础组件
│   │   └── layout/             # 布局组件
│   ├── lib/
│   │   └── types.ts            # 核心类型定义
│   └── mocks/                  # Mock 数据
├── backend/                     # FastAPI 后端
│   ├── app/
│   │   ├── api/                # API 路由
│   │   ├── engines/            # 核心引擎模块
│   │   │   ├── capacity.py     # Training Capacity Engine
│   │   │   ├── risk.py         # Training Risk Engine
│   │   │   ├── acwr.py         # ACWR Engine
│   │   │   └── monotony.py     # Monotony Engine
│   │   ├── models/             # SQLAlchemy 模型
│   │   ├── schemas/            # Pydantic schemas
│   │   └── services/           # 业务逻辑
│   ├── alembic/                # 数据库迁移
│   └── tests/
├── doc/                         # 产品文档
│   └── prd-v1.1.md            # 最新 PRD
└── AGENTS.md                   # 本文件
```

---

## 开发命令参考

### Frontend
```bash
cd frontend
npm install
npm run dev          # 开发服务器 http://localhost:3000
npm run build        # 构建
npm run type-check   # TypeScript 类型检查
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload    # 开发服务器 http://localhost:8000
alembic upgrade head              # 数据库迁移
pytest                            # 运行测试
```

---

## 常见问题与注意事项

### Q: Readiness 指标如何处理？
A: Readiness 是 Training Capacity 的**内部子维度**，用于计算和解释，但**不在 Today 首页并列展示**。可以在专业详情折叠面板中展示。

### Q: 可以展示「受伤概率」吗？
A: **绝对禁止**。所有风险在用户侧统一表达为「训练风险」，只展示等级和建议，不展示百分比。内部可以用 risk_score 计算，但永远不直接展示给用户。

### Q: AI Coach 可以做什么？
A: AI Coach 只负责：解释、总结、教育、鼓励、问答。**绝对禁止**：决定训练负荷、推翻安全规则、推翻风险判断、输出医学诊断。

### Q: MVP 阶段可以做 Goal Planning 吗？
A: 可以作为 Settings 中的目标设置，但**不做** Goal Feasibility Analysis（V2 功能）。MVP 的目标是「今天该练什么」，不是「我距离目标还有多远」。

### Q: 数据不足时如何处理？
A: 所有核心指标必须带 `data_quality` 和 `confidence` 字段，数据不足时：
- 保守建议，不做强预测
- 向用户说明「正在建立训练基线」
- 随着数据积累逐步提升准确度

---

## 文档索引

| 文档 | 用途 |
|---|---|
| `doc/prd-v1.1.md` | 最新产品需求文档（主要参考） |
| `doc/bak/prd.md` | 旧版 PRD（历史参考） |
| `doc/bak/training-engine-spec.md` | 训练引擎技术规范 |
| `AGENTS.md` | 本文件（Agent 开发指引） |
