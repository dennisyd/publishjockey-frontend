import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableItem({ id, children, isSelected, onSelect, onEdit, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      button
      selected={isSelected}
      onClick={onSelect}
      sx={{ 
        pl: 4, 
        borderLeft: isSelected ? '3px solid #4fd1c5' : 'none',
        position: 'relative',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          '& .section-actions': {
            opacity: 1
          }
        }
      }}
    >
      {/* Drag Handle */}
      <Box
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'grab',
          color: 'rgba(0, 0, 0, 0.6)',
          mr: 1,
          display: 'flex',
          alignItems: 'center',
          '&:hover': {
            color: 'rgba(0, 0, 0, 0.8)',
          },
          '&:active': {
            cursor: 'grabbing',
          }
        }}
      >
        <DragIcon fontSize="small" />
      </Box>

      <ListItemText primary={children} />
      
      <Box 
        className="section-actions"
        sx={{ 
          opacity: 0, 
          transition: 'opacity 0.2s',
          display: 'flex',
          gap: 0.5
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip title="Edit section">
          <IconButton 
            size="small" 
            onClick={onEdit}
            sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete section">
          <IconButton 
            size="small" 
            onClick={onDelete}
            sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </ListItem>
  );
}

interface ReorderableSectionProps {
  sections: string[];
  onReorder: (newSections: string[]) => void;
  selectedIndex: number | null;
  onSelectSection: (index: number) => void;
  onEditSection: (index: number) => void;
  onDeleteSection: (index: number) => void;
  loading?: boolean;
  matterType: 'front' | 'main' | 'back';
}

export default function ReorderableSection({
  sections,
  onReorder,
  selectedIndex,
  onSelectSection,
  onEditSection,
  onDeleteSection,
  loading = false,
  matterType
}: ReorderableSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before activating drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const activeIndex = sections.findIndex(section => `${matterType}-${section}` === active.id);
      const overIndex = sections.findIndex(section => `${matterType}-${section}` === over?.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        const newSections = arrayMove(sections, activeIndex, overIndex);
        onReorder(newSections);
      }
    }
  }

  if (loading) {
    return (
      <List disablePadding>
        <ListItem>
          <ListItemText primary="Loading sections..." />
        </ListItem>
      </List>
    );
  }

  const items = sections.map(section => `${matterType}-${section}`);

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <List disablePadding>
          {sections.map((section, index) => (
            <SortableItem
              key={`${matterType}-${section}`}
              id={`${matterType}-${section}`}
              isSelected={selectedIndex === index}
              onSelect={() => onSelectSection(index)}
              onEdit={() => onEditSection(index)}
              onDelete={() => onDeleteSection(index)}
            >
              {section}
            </SortableItem>
          ))}
        </List>
      </SortableContext>
    </DndContext>
  );
}
