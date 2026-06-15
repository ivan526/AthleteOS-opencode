# AthleteOS 开发指南

## 项目结构

```
AthleteOS-opencode/
├── frontend/                 # Next.js 前端
│   ├── app/
│   │   ├── (tabs)/          # 页面路由
│   │   │   ├── today/       # 今日训练
│   │   │   ├── history/     # 历史数据
│   │   │   ├── review/      # 每周复盘
│   │   │   └── settings/    # 设置
│   ├── components/
│   │   ├── training/         # 训练相关组件
│   │   ├── layout/           # 布局组件
│   │   └── ui/               # shadcn/ui
│   ├── lib/
│   │   └── types.ts          # 核心类型定义
│   ├── mocks/                # Mock 数据
│   └── package.json
├── backend/                  # FastAPI 后端
│   ├── app/
│   │   ├── api/              # API 路由
│   │   ├── engines/          # 核心计算引擎
│   │   │   ├── acwr.py       # ACWR 引擎
│   │   │   ├── monotony.py   # Monotony 引擎
│   │   │   ├── capacity.py   # Training Capacity 引擎
│   │   │   ├── risk.py       # Training Risk 引擎
│   │   │   └── recommendation.py  # 训练建议引擎
│   │   ├── models/           # SQLAlchemy 模型
│   │   ├── schemas/          # Pydantic 类型
│   │   ├── services/         # 业务逻辑
│   │   └── database.py
│   ├── run.py                # 启动脚本
│   └── requirements.txt
├── doc/                      # 产品文档
├── AGENTS.md                 # Agent 开发指引
└── README.md
```

## 开发命令

### 前端开发

```bash
cd frontend
npm install
npm run dev
# 访问 http://localhost:3000
```

### 后端开发

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
# 访问 http://localhost:8000
# API 文档 http://localhost:8000/docs
```

## API 端点

### Training API

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/v1/training/today` | GET | 获取今日训练数据 |
| `/api/v1/training/history` | GET | 获取历史负荷数据 |
| `/api/v1/training/weekly-review` | GET | 获取每周复盘 |

## 核心计算引擎

### ACWR 引擎
- 急性慢性负荷比 = 7天总负荷 / (28天总负荷 / 4)
- 安全区间: 0.8 - 1.3
- 风险阈值: > 1.5 禁止高强度

### Monotony 引擎
- 训练单调性 = 日均负荷均值 / 日均负荷标准差
- 健康区间: < 1.5
- 高风险: > 2.5

### Training Capacity 引擎
- 综合评分 0-100，8 维度加权
- Sleep (20%), HRV (10%), Form (15%), ACWR (10%)
- Monotony (10%), Adherence (15%), Subjective Fatigue (10%), Recovery Trend (10%)

### Training Risk 引擎
- 综合风险评分 0-1，5 维度加权
- ACWR (35%), Monotony (20%), Form (20%), Strain (15%), Intensity (10%)

## 前端联调 API

当前后端使用 Mock 数据服务，可直接用于前端联调。所有 API 响应格式已与前端类型定义对齐。
