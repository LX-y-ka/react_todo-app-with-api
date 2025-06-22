import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  deletingTodosId: number[];
  onCheck: (todosId: number[], completed: boolean) => void;
  onDelete: (id: number) => void;
  togglingTodosId: number[];
  onEditTodo: (todo: Todo, title: string) => void;
  titleUdatingTodosId: Map<number, boolean>;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  deletingTodosId,
  onDelete,
  onCheck,
  togglingTodosId,
  onEditTodo,
  titleUdatingTodosId,
}) => {
  const { id, title, completed } = todo;
  const [todoEditing, setTodoEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [newTitle, setNewTitle] = useState(title);
  const waitingForTitleEditing = useRef(false);

  const onSubmitTitle = () => {
    const trimTitle = newTitle.trim();

    if (trimTitle === title) {
      setTodoEditing(false);

      return;
    }

    waitingForTitleEditing.current = true;

    onEditTodo(todo, trimTitle);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTodoEditing(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    if (todoEditing && inputRef.current) {
      inputRef.current.focus();
    }

    if (waitingForTitleEditing.current && !titleUdatingTodosId.has(id)) {
      setTodoEditing(false);
      waitingForTitleEditing.current = false;
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [titleUdatingTodosId, id, todoEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          name="checkbox"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onCheck([todo.id], !completed)}
        />
      </label>

      {todoEditing ? (
        <form>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSubmitTitle();
              }
            }}
            onBlur={() => onSubmitTitle()}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setTodoEditing(true);
          }}
        >
          {title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      {!todoEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            id === 0 ||
            deletingTodosId?.includes(id) ||
            togglingTodosId?.includes(id) ||
            (titleUdatingTodosId.has(id) && titleUdatingTodosId.get(id)),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
