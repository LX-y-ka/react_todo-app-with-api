import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodosId: number[];
  onDelete: (id: number) => void;
  onCheck: (todosId: number[], completed: boolean) => void;
  togglingTodosId: number[];
  onEditTodo: (todo: Todo, title: string) => void;
  editingTodos: Map<number, boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodosId,
  onDelete,
  onCheck,
  togglingTodosId,
  onEditTodo,
  editingTodos,
}) => {
  const newArray = tempTodo ? todos.concat(tempTodo) : todos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {newArray.map(t => (
        <TodoInfo
          key={t.id}
          todo={t}
          deletingTodosId={deletingTodosId}
          onCheck={onCheck}
          onDelete={onDelete}
          togglingTodosId={togglingTodosId}
          onEditTodo={onEditTodo}
          titleUdatingTodosId={editingTodos}
        />
      ))}
    </section>
  );
};
