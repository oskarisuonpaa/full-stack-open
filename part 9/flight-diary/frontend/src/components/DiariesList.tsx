import { Diary } from "../types";

interface Props {
  diaries: Diary[];
}

const DiariesList = ({ diaries }: Props) => {
  return (
    <div>
      {Object.values(diaries).map((diary: Diary) => {
        return !diary.comment ? (
          <div key={diary.id}>
            <h3>{diary.date}</h3>
            visibility: {diary.visibility}
            <br />
            weather: {diary.weather}
          </div>
        ) : (
          <div key={diary.id}>
            <strong>{diary.date}</strong>
            <br />
            <br />
            visibility: {diary.visibility}
            <br />
            weather: {diary.weather}
            <br />
            comment: {diary.comment}
          </div>
        );
      })}
    </div>
  );
};

export default DiariesList;
