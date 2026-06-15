# AthleteOS - 智能训练计划跟踪系统

> AI 驱动的耐力运动训练管理平台，基于运动科学的训练负荷监控与智能推荐

[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-00a393.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3+-38bdf8.svg)](https://tailwindcss.com/)

## ✨ 核心功能

### 🧠 5 大训练计算引擎
| 引擎 | 功能描述 |
|------|---------|
| **Training Capacity** | 综合训练能力评分（0-100），基于睡眠、HRV、疲劳等多维度 |
| **Training Risk** | 训练风险评估（低/中/高/极高），避免过度训练 |
| **ACWR** | 急性/慢性负荷比，监控短期与长期负荷平衡 |
| **Monotony** | 训练单调性指数，预防训练单一化 |
| **Recommendation** | 智能训练推荐，基于当前状态给出训练建议 |

### 📱 5 个核心页面
1. **登录/注册** - 用户认证系统
2. **今日训练** - 训练能力 + 风险评估 + 今日推荐
3. **历史数据** - 负荷趋势图表 + 训练记录
4. **每周复盘** - AI 生成的周总结与改进建议
5. **设置** - Intervals.icu 数据同步 + 用户信息管理

### 🔗 数据源集成
- **Intervals.icu API** - 同步活动、体能、健康数据
- 支持 Strava、Garmin、Polar 等主流运动平台（通过 Intervals.icu）

## 🚀 快速开始

### 一键启动（推荐）

```bash
# 克隆项目
git clone https://github.com/ivan526/AthleteOS-opencode.git
cd AthleteOS-opencode

# 一键启动前后端
./start.sh
```

### 手动启动

**后端服务** (端口 8001):
```bash
cd backend
pip install -r requirements.txt
python init_db.py  # 初始化数据库
python main.py
```

**前端服务** (端口 8080):
```bash
cd frontend
npm install
npm run dev
```

### 访问地址

| 服务 | 地址 |
|------|------|
| 前端应用 | http://localhost:8080 |
| 后端 API | http://localhost:8001 |
| API 文档 | http://localhost:8001/docs |

### 演示账号

- **邮箱**: `demo@athleteos.app`
- **密码**: `demo123456`

## 📖 配置指南

### 连接 Intervals.icu

1. 登录 [Intervals.icu](https://intervals.icu)
2. 进入 **Settings** → **API Keys**
3. 创建新的 API Key (只读权限即可)
4. 在 AthleteOS 设置页面填写：
   - **API Key**: 刚才创建的密钥
   - **Athlete ID**: 在 Intervals.icu 个人资料页面查看你的 ID

### 环境变量配置

参考 `backend/.env.example`，可复制为 `.env` 自定义：

```bash
JWT_SECRET_KEY=your-secret-key        # JWT 签名密钥
ACCESS_TOKEN_EXPIRE_MINUTES=10080     # Token 有效期（7天）
```

## 🏗 技术架构

### 后端技术栈
- **FastAPI** - 高性能 Python Web 框架
- **SQLAlchemy** - ORM 数据库操作
- **Pydantic** - 数据验证
- **PyJWT** - JWT 认证
- **bcrypt** - 密码加密
- **SQLite** - 数据库（生产环境可切换为 PostgreSQL）

### 前端技术栈
- **Next.js 16** - React 全栈框架
- **TypeScript** - 类型安全
- **TailwindCSS** - 原子化 CSS
- **shadcn/ui** - UI 组件库
- **Zustand** - 状态管理

### 项目结构

```
AthleteOS-opencode/
├── backend/
│   ├── app/
│   │   ├── api/              # API 端点
│   │   ├── core/             # 核心工具（认证、错误处理）
│   │   ├── crud/             # 数据库操作
│   │   ├── engines/          # 训练计算引擎
│   │   ├── models/           # 数据模型
│   │   └── schemas/          # Pydantic 模式
│   ├── alembic/              # 数据库迁移
│   ├── init_db.py            # 数据库初始化脚本
│   ├── main.py               # 应用入口
│   └── requirements.txt      # Python 依赖
├── frontend/
│   ├── app/                  # Next.js 页面路由
│   ├── components/           # React 组件
│   │   ├── training/         # 训练相关组件
│   │   └── ui/               # 基础 UI 组件
│   └── lib/                  # 工具库
├── start.sh                  # 一键启动脚本
├── AGENTS.md                 # 开发代理配置
└── DEVELOPMENT.md            # 开发文档
```

## 🧪 API 端点

### 认证接口
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录（OAuth2 密码模式）
- `GET /api/v1/auth/me` - 获取当前用户信息

### 训练接口
- `GET /api/v1/training/today` - 获取今日训练数据
- `GET /api/v1/training/history` - 获取历史训练数据
- `GET /api/v1/training/weekly-review` - 获取每周复盘

### 同步接口
- `POST /api/v1/sync/intervals-icu` - 从 Intervals.icu 同步数据
- `GET /api/v1/sync/status` - 获取同步状态

### 设置接口
- `GET /api/v1/settings` - 获取用户设置
- `PUT /api/v1/settings` - 更新用户设置
- `POST /api/v1/settings/sync` - 使用已保存凭据同步

## 📊 数据模型

### Training Capacity (训练能力)
- **范围**: 0-100
- **维度**: 睡眠质量、HRV、Form、ACWR、单调性、训练依从性、主观疲劳、恢复趋势
- **等级**: 
  - 81-100: Ready to Push（可以高强度训练）
  - 61-80: Train Normally（正常训练）
  - 41-60: Reduce Intensity（降低强度）
  - 0-40: Recovery Required（优先恢复）

### Training Risk (训练风险)
- **等级**: Low / Moderate / Elevated / High Caution
- **因素**: ACWR、单调性、Form、连续训练天数、睡眠质量

## 🔧 开发命令

```bash
# 启动服务
./start.sh              # 启动前后端
./start.sh stop         # 停止服务
./start.sh restart      # 重启服务
./start.sh status       # 查看服务状态

# 后端
cd backend
python init_db.py       # 初始化数据库
python main.py          # 启动开发服务器

# 前端
cd frontend
npm run dev             # 启动开发服务器
npm run build           # 构建生产版本
```

## 🎯 MVP 功能清单

✅ **已完成 (v1.0 MVP)**
- [x] 用户认证系统（注册/登录/JWT）
- [x] Intervals.icu 数据同步
- [x] Training Capacity 计算引擎
- [x] Training Risk 计算引擎
- [x] ACWR 计算引擎
- [x] Monotony 计算引擎
- [x] 训练推荐引擎
- [x] 每周复盘生成
- [x] 前端 5 个完整页面
- [x] 骨架屏加载状态
- [x] Toast 全局通知
- [x] 登出确认弹窗
- [x] 统一错误处理
- [x] 一键启动脚本
- [x] 数据库初始化工具

🔮 **V2 规划（未来版本）**
- [ ] 多运动项目支持（骑行、游泳、铁人三项）
- [ ] 训练计划生成与管理
- [ ] 长期表现预测
- [ ] 团队/教练功能
- [ ] 数据导出/分享
- [ ] 移动端 App
- [ ] 训练笔记/感受记录

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## ⚠️ 免责声明

AthleteOS 是一个训练辅助工具，不能替代专业的医疗建议。如有疼痛或不适，请咨询专业医生。训练负荷应根据个人身体状况进行调整。

---

**🏃‍♂️ 科学训练，远离伤痛，持续进步！**
