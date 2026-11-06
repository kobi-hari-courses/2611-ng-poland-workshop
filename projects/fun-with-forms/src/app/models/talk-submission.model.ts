export interface Speaker {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
}

export interface TalkSubmission {
  title: string;
  abstract: string;
  expertise: number;
  speaker: Speaker;
  coSpeakers: Speaker[];
}

export function emptySpeaker(): Speaker {
  return {
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
  };
}

export function emptyTalkSubmission(): TalkSubmission {
  return {
    title: '',
    abstract: '',
    expertise: 0,
    speaker: emptySpeaker(),
    coSpeakers: [],
  };
}
