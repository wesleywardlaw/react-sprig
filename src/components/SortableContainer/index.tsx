import React, { ReactNode, useState } from 'react'
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Props for the generic sortable container
interface SortableContainerProps {
  children: ReactNode[]
  className?: string
  itemClassName?: string
}

// Default styling for all sortable items
const defaultItemStyle = 'p-3 bg-white shadow-md rounded-md cursor-grab'

const SortableItem: React.FC<{ id: string; children: ReactNode; className?: string }> = ({
  id,
  children,
  className,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${defaultItemStyle} ${className || ''}`}
      data-testid={`sortable-item-${id}`}
    >
      {children}
    </div>
  )
}

export const SortableContainer: React.FC<SortableContainerProps> = ({
  children,
  className,
  itemClassName,
}) => {
  const [items, setItems] = useState(
    children.map((child, index) => ({ id: `item-${index}`, content: child }))
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)
      setItems(arrayMove(items, oldIndex, newIndex))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((i) => i.id)}>
        <div className={`space-y-2 ${className}`}>
          {items.map((i) => (
            <SortableItem
              key={i.id}
              id={i.id}
              className={itemClassName}
            >
              {i.content}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
