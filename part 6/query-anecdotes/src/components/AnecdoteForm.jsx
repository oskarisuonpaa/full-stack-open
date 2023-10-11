import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../requests";
import { useNotify } from "../NotificationContext";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const notify = useNotify();

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: ({ content }) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      notify(`anecdote '${content}' created`);
    },
    onError: (error) => {
      notify(error.response.data.error);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
