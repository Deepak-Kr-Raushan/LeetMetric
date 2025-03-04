document.addEventListener("DOMContentLoaded", () => {

    const searchButton = document.querySelector("#search-btn");
    const userNameInput = document.querySelector("#user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLable = document.querySelector("#easy-lable");
    const mediumLable = document.querySelector("#medium-lable");
    const hardLable = document.querySelector("#hard-lable");
    const cardStatsContainer = document.querySelector(".stats-cards");


    function progressData(solved, total, lable, circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty(`--progress-degree`, `${progressDegree}%`);
        lable.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData){
        const TotalQues = parsedData.data.allQuestionsCount[0].count;
        const TotalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const TotalMediumQues = parsedData.data.allQuestionsCount[2].count;
        const TotalHardQues = parsedData.data.allQuestionsCount[3].count;

        const solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        progressData(solvedTotalEasyQues, TotalEasyQues, easyLable, easyProgressCircle);
        progressData(solvedTotalMediumQues, TotalMediumQues, mediumLable, mediumProgressCircle);
        progressData(solvedTotalHardQues, TotalHardQues, hardLable, hardProgressCircle);

        let cardsData = [
            {lable: "Overall Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
            {lable: "Overall Easy Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
            {lable: "Overall Medium Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
            {lable: "Overall Hard Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions}
        ];
        
        cardStatsContainer.innerHTML = cardsData.map(data => 
            `
                <div class="card">
                <h4>${data.lable}</h4>
                <p>${data.value}</p>
                </div>
            `

        ).join("");
    }

    async function fetchIdDetails(userName){

        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            searchButton.style.color = "rgb(164, 255, 183)";
            
            const proxyURL = `https://cors-anywhere.herokuapp.com/`;
            const targetUrl = 'https://leetcode.com/graphql/';
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: `
                query userSessionProgress($username: String!) {
                    allQuestionsCount {
                    difficulty
                    count
                    }
                    matchedUser(username: $username) {
                    submitStats {
                        acSubmissionNum {
                        difficulty
                        count
                        submissions
                        }
                        totalSubmissionNum {
                        difficulty
                        count
                        submissions
                        }
                    }
                    }
                }
                `,
                variables: { "username": `${userName}` }
            });
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql
            };

            const response = await fetch(proxyURL + targetUrl, requestOptions);

            if(!response.ok) {
                throw new Error ("Unable to fetch the user details");
            } else {
                const parsedData = await response.json();
                console.log(parsedData);
                displayUserData(parsedData);
            }
        } catch(err){
            statsContainer.innerHTML = "<h3>Data Not Found!</h3>"
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
            searchButton.style.color = "black";
        }

    }

    function validateUsername(userName) {
        if(userName.trim() === "") {
            alert("Username should not be empty!");
            return false;
        }
        const regex = /^(?!.*[-_]{2})[a-zA-Z0-9][a-zA-Z0-9_-]{0,13}[a-zA-Z0-9]$/;
        const isMatching = regex.test(userName);
        console.log(isMatching);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }

    searchButton.addEventListener("click", () => {
        const userName = userNameInput.value;
        console.log(`Logging: ${userName}`);
        if(validateUsername(userName)) {
            fetchIdDetails(userName);
        }
    });
});