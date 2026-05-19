 document.getElementsByTagName("p")[0].onmouseover = function() {
        this.innerText = 'Pink is her fav color' ;this.style.color = 'red';
    }

 document.getElementsByTagName("p")[0].onmouseout = function() {
        this.innerText = 'More me'; this.style.color = 'black';
    }
    