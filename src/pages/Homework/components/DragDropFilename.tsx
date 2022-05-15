import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Tag } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TweenOneGroup } from 'rc-tween-one';
import './DragDropFilename.css';

interface Iprops {
  value?: API.Ifilename[];
  onChange?: <T>(p: T) => void;
}

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const DragDropFilename: React.ForwardRefExoticComponent<Iprops & React.RefAttributes<unknown>> =
  forwardRef((props: Iprops, ref: any) => {
    const { value = [], onChange } = props;
    const [items, setItems] = useState<API.Ifilename[]>(value);
    const onChangeRef = useRef(onChange);

    const onDragEnd = (result: any) => {
      if (!result.destination) {
        return;
      }
      const _items = reorder(items, result.source.index, result.destination.index);
      setItems(_items);
      onChange!(_items);
    };

    const getListStyle = (isDraggingOver: boolean) => ({
      background: isDraggingOver ? 'lightblue' : 'lightgrey',
      display: 'flex',
      padding: 8,
      overflow: 'auto',
    });

    useEffect(() => {
      onChangeRef.current!(items);
    }, [onChangeRef, items]);

    useImperativeHandle(ref, () => ({
      addTag: (id: string, content: string, color: string = 'cyan') => {
        const _items = [...items, { id: id, content: content, color: color }];
        setItems(_items);
        onChange!(_items);
      },
    }));

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              <TweenOneGroup
                enter={{
                  scale: 0.8,
                  opacity: 0,
                  type: 'from',
                  duration: 100,
                }}
                onEnd={(e) => {
                  if (e.type === 'appear' || e.type === 'enter') {
                    (e.target as HTMLElement).setAttribute('style', 'display:inline-block');
                  }
                }}
                leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                appear={false}
                style={{ display: 'flex' }}
              >
                {items.map((item, index) => (
                  <span key={item.id} style={{ display: 'inline-block' }}>
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(_provided) => (
                        <div
                          ref={_provided.innerRef}
                          {..._provided.draggableProps}
                          {..._provided.dragHandleProps}
                        >
                          <Tag
                            color={item.color}
                            closable={true}
                            onClose={(e) => {
                              e.preventDefault();
                              const result = items.filter((i) => i !== item);
                              setItems(result);
                              onChange!(result);
                            }}
                          >
                            {item.content}
                          </Tag>
                        </div>
                      )}
                    </Draggable>
                  </span>
                ))}
              </TweenOneGroup>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  });
export default DragDropFilename;
