#!/bin/bash
# rollback-all.sh - 一键回滚到配置前状态

echo "开始回滚..."

# 1. 恢复openclaw.json
if [ -f ~/.openclaw/backups/2026-03-09-multi-agent/openclaw.json.bak ]; then
  cp ~/.openclaw/backups/2026-03-09-multi-agent/openclaw.json.bak ~/.openclaw/openclaw.json
  echo "✅ 已恢复openclaw.json"
else
  echo "⚠️ 备份文件不存在"
fi

# 2. 删除新建的workspace
rm -rf ~/.openclaw/workspace-coding
rm -rf ~/.openclaw/workspace-research
rm -rf ~/.openclaw/workspace-ops
rm -rf ~/.openclaw/workspace-design
rm -rf ~/.openclaw/workspace-evolution
echo "✅ 已删除新建的workspace目录"

# 3. 删除新建的agent目录
rm -rf ~/.openclaw/agents/coding
rm -rf ~/.openclaw/agents/research
rm -rf ~/.openclaw/agents/ops
rm -rf ~/.openclaw/agents/design
rm -rf ~/.openclaw/agents/evolution
echo "✅ 已删除新建的agent目录"

# 4. 重启Gateway
openclaw gateway restart
echo "✅ 已重启Gateway"

echo ""
echo "🎉 回滚完成！"