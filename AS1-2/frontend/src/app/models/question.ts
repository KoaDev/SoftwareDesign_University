export interface Question {
    _id? : string;
    title : string;
    body : string;
    author : string;
    tags : Array<string>;
    upvotes? : Array<string>;
    downvotes? : Array<string>;
    answers? : Array<string>;
    comments? : Array<string>;
    timestamp : string;
    __v? : number;
}