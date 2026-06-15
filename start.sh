#!/bin/bash
# AthleteOS 一键启动脚本
# 功能: 检测并停止已运行的服务，然后重新启动前端和后端

set -e

echo "========================================="
echo "   AthleteOS 一键启动脚本"
echo "========================================="

# 项目根目录
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# 端口配置
BACKEND_PORT=8001
FRONTEND_PORT=8080

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查端口并杀死进程
kill_port() {
    local port=$1
    local name=$2
    
    if command -v lsof &> /dev/null; then
        PIDS=$(lsof -ti:$port 2>/dev/null || true)
    elif command -v netstat &> /dev/null; then
        PIDS=$(netstat -tlnp 2>/dev/null | grep ":$port" | awk '{print $7}' | cut -d'/' -f1 || true)
    else
        echo -e "${YELLOW}⚠️  无法检测端口，请安装 lsof 或 netstat${NC}"
        return
    fi
    
    if [ -n "$PIDS" ]; then
        echo -e "${YELLOW}🔍 检测到 $name (端口 $port) 正在运行...${NC}"
        for pid in $PIDS; do
            if [ -n "$pid" ] && kill -0 $pid 2>/dev/null; then
                echo -e "   正在停止进程 PID: $pid"
                kill -9 $pid 2>/dev/null || true
                sleep 1
            fi
        done
        echo -e "${GREEN}✅ $name 已停止${NC}"
    else
        echo -e "✅ 端口 $port 未被占用"
    fi
}

# 检查目录是否存在
check_dirs() {
    echo ""
    echo "📁 检查项目目录..."
    
    if [ ! -d "$BACKEND_DIR" ]; then
        echo -e "${RED}❌ 后端目录不存在: $BACKEND_DIR${NC}"
        exit 1
    fi
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        echo -e "${RED}❌ 前端目录不存在: $FRONTEND_DIR${NC}"
        exit 1
    fi
    
    echo "   ✅ 后端目录: $BACKEND_DIR"
    echo "   ✅ 前端目录: $FRONTEND_DIR"
}

# 停止现有服务
stop_services() {
    echo ""
    echo "🛑 检查并停止现有服务..."
    
    kill_port $BACKEND_PORT "后端服务"
    kill_port $FRONTEND_PORT "前端服务"
    
    # 额外清理可能的 Python/Node 进程
    echo ""
    echo "🧹 清理残留进程..."
    pkill -f "uvicorn.*app.main" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    sleep 1
}

# 启动后端
start_backend() {
    echo ""
    echo "🚀 启动后端服务 (端口 $BACKEND_PORT)..."
    
    cd "$BACKEND_DIR"
    
    # 检查虚拟环境
    if [ -d "venv" ]; then
        echo "   ✅ 使用虚拟环境"
        VENV_PYTHON="$BACKEND_DIR/venv/bin/python"
        VENV_UVICORN="$BACKEND_DIR/venv/bin/uvicorn"
    else
        echo "   ⚠️  未找到虚拟环境，使用系统 Python"
        VENV_PYTHON="python3"
        VENV_UVICORN="uvicorn"
    fi
    
    # 检查端口是否可用
    if lsof -Pi:$BACKEND_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}❌ 端口 $BACKEND_PORT 仍然被占用，请手动检查${NC}"
        exit 1
    fi
    
    # 后台启动后端
    nohup $VENV_UVICORN app.main:app --reload --host 0.0.0.0 --port $BACKEND_PORT > /tmp/athleteos-backend.log 2>&1 &
    BACKEND_PID=$!
    
    # 等待启动
    sleep 3
    
    # 检查是否启动成功
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 后端服务已启动 (PID: $BACKEND_PID)${NC}"
        echo "   📄 日志文件: /tmp/athleteos-backend.log"
        echo "   🌐 API 地址: http://localhost:$BACKEND_PORT"
        echo "   📖 文档地址: http://localhost:$BACKEND_PORT/docs"
    else
        echo -e "${RED}❌ 后端服务启动失败，请查看日志: /tmp/athleteos-backend.log${NC}"
        exit 1
    fi
}

# 启动前端
start_frontend() {
    echo ""
    echo "🚀 启动前端服务 (端口 $FRONTEND_PORT)..."
    
    cd "$FRONTEND_DIR"
    
    # 检查 node_modules
    if [ ! -d "node_modules" ]; then
        echo "   📦 安装依赖..."
        npm install
    fi
    
    # 后台启动前端
    nohup npm run dev -- --port $FRONTEND_PORT > /tmp/athleteos-frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # 等待启动
    sleep 5
    
    # 检查是否启动成功
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 前端服务已启动 (PID: $FRONTEND_PID)${NC}"
        echo "   📄 日志文件: /tmp/athleteos-frontend.log"
        echo "   🌐 访问地址: http://localhost:$FRONTEND_PORT"
    else
        echo -e "${RED}❌ 前端服务启动失败，请查看日志: /tmp/athleteos-frontend.log${NC}"
        exit 1
    fi
}

# 保存 PIDs 用于停止
save_pids() {
    echo ""
    echo "💾 保存进程信息..."
    
    PID_FILE="$PROJECT_DIR/.athleteos-pids"
    cat > "$PID_FILE" << EOF
# AthleteOS 进程文件
# 停止服务: bash start.sh stop
# 查看日志: tail -f /tmp/athleteos-backend.log /tmp/athleteos-frontend.log

BACKEND_PID=$BACKEND_PID
FRONTEND_PID=$FRONTEND_PID
START_TIME=$(date)
EOF
    echo "   ✅ 进程信息已保存到: $PID_FILE"
}

# 停止服务命令
stop_services_cmd() {
    echo "🛑 停止 AthleteOS 所有服务..."
    
    PID_FILE="$PROJECT_DIR/.athleteos-pids"
    
    if [ -f "$PID_FILE" ]; then
        source "$PID_FILE" 2>/dev/null || true
        
        if [ -n "$BACKEND_PID" ] && ps -p $BACKEND_PID > /dev/null 2>&1; then
            echo "   停止后端服务 (PID: $BACKEND_PID)"
            kill -9 $BACKEND_PID 2>/dev/null || true
        fi
        
        if [ -n "$FRONTEND_PID" ] && ps -p $FRONTEND_PID > /dev/null 2>&1; then
            echo "   停止前端服务 (PID: $FRONTEND_PID)"
            kill -9 $FRONTEND_PID 2>/dev/null || true
        fi
        
        rm -f "$PID_FILE"
    fi
    
    # 额外清理
    kill_port $BACKEND_PORT "后端服务"
    kill_port $FRONTEND_PORT "前端服务"
    
    # 清理日志
    rm -f /tmp/athleteos-backend.log /tmp/athleteos-frontend.log 2>/dev/null
    
    echo -e "${GREEN}✅ 所有服务已停止${NC}"
    exit 0
}

# 显示状态
show_status() {
    echo "📊 AthleteOS 服务状态"
    echo ""
    
    # 检查后端
    if lsof -Pi:$BACKEND_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ 后端服务: 运行中 (端口 $BACKEND_PORT)${NC}"
    else
        echo -e "${RED}❌ 后端服务: 未运行${NC}"
    fi
    
    # 检查前端
    if lsof -Pi:$FRONTEND_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ 前端服务: 运行中 (端口 $FRONTEND_PORT)${NC}"
    else
        echo -e "${RED}❌ 前端服务: 未运行${NC}"
    fi
    
    # 显示日志位置
    echo ""
    echo "📄 日志位置:"
    echo "   后端: /tmp/athleteos-backend.log"
    echo "   前端: /tmp/athleteos-frontend.log"
    
    exit 0
}

# 显示帮助
show_help() {
    echo "使用方法:"
    echo "  bash start.sh [命令]"
    echo ""
    echo "命令:"
    echo "  start    启动服务 (默认)"
    echo "  stop     停止服务"
    echo "  restart  重启服务"
    echo "  status   查看服务状态"
    echo "  help     显示帮助"
    echo ""
    echo "示例:"
    echo "  bash start.sh          # 启动服务"
    echo "  bash start.sh stop     # 停止服务"
    echo "  bash start.sh restart  # 重启服务"
    exit 0
}

# 主逻辑
case "${1:-start}" in
    stop)
        stop_services_cmd
        ;;
    restart)
        stop_services
        check_dirs
        start_backend
        start_frontend
        save_pids
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    start)
        stop_services
        check_dirs
        start_backend
        start_frontend
        save_pids
        ;;
    *)
        echo -e "${RED}❌ 未知命令: $1${NC}"
        show_help
        ;;
esac

echo ""
echo "========================================="
echo "   🎉 AthleteOS 启动完成！"
echo "========================================="
echo ""
echo "📱 访问地址:"
echo "   前端: http://localhost:$FRONTEND_PORT"
echo "   后端 API: http://localhost:$BACKEND_PORT"
echo ""
echo "🔧 其他命令:"
echo "   查看状态: bash start.sh status"
echo "   停止服务: bash start.sh stop"
echo "   重启服务: bash start.sh restart"
echo ""
echo "📄 查看日志:"
echo "   后端: tail -f /tmp/athleteos-backend.log"
echo "   前端: tail -f /tmp/athleteos-frontend.log"
echo ""
