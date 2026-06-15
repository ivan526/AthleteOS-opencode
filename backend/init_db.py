#!/usr/bin/env python3
"""
数据库初始化脚本
运行方式: python init_db.py
"""

import sys
import os

# 添加项目路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base
from app.models import user, activity, recommendation


def init_database():
    """初始化数据库表结构"""
    print("正在创建数据库表...")
    
    # 创建所有表
    Base.metadata.create_all(bind=engine)
    
    print("✓ 数据库表创建完成")
    print("\n创建的表:")
    for table in Base.metadata.tables.keys():
        print(f"  - {table}")


def show_help():
    """显示帮助信息"""
    print("""
AthleteOS 数据库初始化脚本

用法:
  python init_db.py          # 初始化数据库表结构
  python init_db.py --help   # 显示帮助信息

注意:
  - 默认使用 SQLite 数据库 (athleteos.db)
  - 如果数据库已存在，不会覆盖现有数据
  - 要重置数据库，请先删除 .db 文件再运行此脚本
    """)


if __name__ == "__main__":
    if "--help" in sys.argv or "-h" in sys.argv:
        show_help()
        sys.exit(0)
    
    init_database()
    print("\n🎉 数据库初始化完成!")
