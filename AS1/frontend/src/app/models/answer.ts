export interface Answer {
    _id? : string;
    body : string;
    author : string;
    question : string;
    upvotes? : Array<string>;
    downvotes? : Array<string>;
    comments? : Array<string>;
    timestamp : string;
    __v? : number;
}