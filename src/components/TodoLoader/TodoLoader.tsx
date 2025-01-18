type Props = {
  isActiveLoader: boolean;
};

export const TodoLoader: React.FC<Props> = ({ isActiveLoader }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={`modal overlay ${isActiveLoader ? `is-active` : null}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
