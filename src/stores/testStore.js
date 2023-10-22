import { writable } from 'svelte/store';
import { browser } from "$app/environment"
//contains a an array for test (name, surname, questions)

export const testStore = writable(browser && JSON.parse(localStorage.getItem("currentTest")) || undefined);
if (browser){
    testStore.subscribe(value => {
        localStorage.setItem("currentTest", JSON.stringify(value))
    })
}
export const savedUserAnswers = writable(browser && JSON.parse(localStorage.getItem("savedUserAnswers")) || undefined);
if (browser){
    savedUserAnswers.subscribe(value => {
        localStorage.setItem("savedUserAnswers", JSON.stringify(value))
    })
}
export const savedScore = writable(browser && JSON.parse(localStorage.getItem("savedScore")) || 0);
if (browser){
    savedScore.subscribe(value => {
        localStorage.setItem("savedScore", JSON.stringify(value))
    })
}
export const savedCurrentQuestionIndex = writable(browser && JSON.parse(localStorage.getItem("savedCurrentQuestion")) || 0);
if (browser){
    savedCurrentQuestionIndex.subscribe(value => {
        localStorage.setItem("savedCurrentQuestion", JSON.stringify(value))
    })
}
export const shuffledQuestions = writable(browser && JSON.parse(localStorage.getItem("shuffledQuestions")) || []);
if (browser){
    shuffledQuestions.subscribe(value => {
        localStorage.setItem("shuffledQuestions", JSON.stringify(value))
    })
}
export const savedTestCompleted = writable(browser && JSON.parse(localStorage.getItem("isTestCompleted")) || false);
if (browser){
    savedTestCompleted.subscribe(value => {
        localStorage.setItem("isTestCompleted", JSON.stringify(value))
    })
}
export const savedReviewMode = writable(browser && JSON.parse(localStorage.getItem("isReviewMode")) || false);
if (browser){
    savedReviewMode.subscribe(value => {
        localStorage.setItem("isReviewMode", JSON.stringify(value))
    })
}
/*export const curTestData = writable(browser && JSON.parse(localStorage.getItem("testData")) || undefined)
if (browser){
    curTestData.subscribe(value => {
        localStorage.setItem("testData", JSON.stringify(value))
    })
}*/
