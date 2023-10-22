const Header = ({ course }) => <h1>{course.name}</h1>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => {
  if (parts.lenght === 0) return;

  return (
    <ul>
      {parts.map((part) => (
        <li key={part.id}>
          <Part part={part} />
        </li>
      ))}
    </ul>
  );
};

const Total = ({ parts }) => {
  const totalExercises = parts
    .map((part) => part.exercises)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return <b>total of {totalExercises} exercises</b>;
};

const Course = ({ course }) => (
  <>
    <Header course={course} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </>
);

export default Course;
