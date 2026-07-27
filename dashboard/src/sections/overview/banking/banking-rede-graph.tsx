import type { AffiliateNode } from './view/banking-rede-view';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { BankingRedeAffiliateDrawer } from './banking-rede-affiliate-drawer';

// ----------------------------------------------------------------------

type Props = {
  treeData: AffiliateNode[];
  focusedId: string | null;
};

export function BankingRedeGraph({ treeData, focusedId }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<AffiliateNode | null>(null);

  const handleOpenNode = (node: AffiliateNode) => {
    setSelectedNode(node);
    setDrawerOpen(true);
  };

  return (
    <>
      <Card sx={{ height: '100%', minHeight: 400 }}>
        <CardHeader
          title="Grafo de Indicações"
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" color="inherit">
                Expandir Nível 2
              </Button>
            </Box>
          }
        />

        <Box sx={{ p: 3 }}>
          <TextField
            placeholder="Buscar por nome ou ID..."
            size="small"
            fullWidth
            sx={{ mb: 3 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon={'solar:magnifer-bold' as any}
                      width={20}
                      sx={{ color: 'text.disabled' }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 2, overflowX: 'auto' }}>
            {treeData.map((node) => (
              <AffiliateTreeNode
                key={node.id}
                node={node}
                onOpenNode={handleOpenNode}
                focusedId={focusedId}
              />
            ))}
          </Box>
        </Box>
      </Card>

      {selectedNode && (
        <BankingRedeAffiliateDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          node={selectedNode}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type NodeProps = {
  node: AffiliateNode;
  onOpenNode: (node: AffiliateNode) => void;
  focusedId: string | null;
  isLast?: boolean;
};

function AffiliateTreeNode({ node, onOpenNode, focusedId, isLast }: NodeProps) {
  const [expanded, setExpanded] = useState(true);

  const hasChildren = node.children && node.children.length > 0;
  const isFocused = node.id === focusedId;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'success';
      case 'Pendente':
        return 'warning';
      case 'Inativo':
        return 'default';
      case 'Suspenso':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ position: 'relative', ml: node.level > 0 ? 3 : 0, mt: 1 }}>
      {/* Branch line */}
      {node.level > 0 && (
        <Box
          sx={{
            position: 'absolute',
            left: -16,
            top: 24,
            width: 16,
            height: 2,
            bgcolor: 'divider',
          }}
        />
      )}
      {node.level > 0 && !isLast && (
        <Box
          sx={{
            position: 'absolute',
            left: -16,
            top: 24,
            bottom: -24,
            width: 2,
            bgcolor: 'divider',
          }}
        />
      )}

      {/* Node Card */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1,
          pr: 2,
          bgcolor: isFocused ? 'primary.lighter' : 'background.paper',
          border: (theme) =>
            `solid 1px ${isFocused ? theme.vars.palette.primary.main : theme.vars.palette.divider}`,
          borderRadius: 1,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
          transition: 'all 0.2s',
        }}
        onClick={() => onOpenNode(node)}
      >
        {hasChildren ? (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            <Iconify
              icon={
                (expanded
                  ? 'solar:minus-square-bold-duotone'
                  : 'solar:add-square-bold-duotone') as any
              }
            />
          </IconButton>
        ) : (
          <Box
            sx={{
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify
              icon={'solar:user-rounded-bold-duotone' as any}
              sx={{ color: 'text.secondary' }}
            />
          </Box>
        )}

        <Box>
          <Typography
            variant="subtitle2"
            sx={{ color: isFocused ? 'primary.main' : 'text.primary' }}
          >
            {node.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Nível {node.level}
            </Typography>
            <Label color={getStatusColor(node.status) as any} sx={{ fontSize: 10, height: 20 }}>
              {node.status}
            </Label>
          </Box>
        </Box>
      </Box>

      {/* Children */}
      {hasChildren && (
        <Collapse in={expanded} unmountOnExit>
          <Box sx={{ position: 'relative', ml: 2 }}>
            <Box
              sx={{
                position: 'absolute',
                left: -16,
                top: 0,
                bottom: 16,
                width: 2,
                bgcolor: 'divider',
              }}
            />
            {node.children!.map((child, index) => (
              <AffiliateTreeNode
                key={child.id}
                node={child}
                onOpenNode={onOpenNode}
                focusedId={focusedId}
                isLast={index === node.children!.length - 1}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}
