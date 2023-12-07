let dataPage=1;
lastAccessed=0;

async function searchByQuery(query,dataPage)
{
    const feed=document.getElementsByClassName('feed')[0];
    
    if (dataPage==1)
    {
        feed.innerHTML=''+
        '<div class="lazyLoad">'+
            '<div class="thumbnail"></div>'+
            '<div class="lazyDetails">'+
                '<div class="lazyName"></div>'+
                '<div class="lazySub"></div>'+
            '</div>'+
        '</div>';
    }

    response=await fetch(
        'https://api.spacexdata.com/v4/launches/query',
        {
            method: 'POST',
            body:
            {
                options:
                {
                    query:
                    {
                        $text:
                        {
                            search: query
                        }
                    },
                    page: dataPage
                }
            }
        }
    );

    if (dataPage==1)
    {
        feed.innerHTML='';
    }
    feedContent=await response.json();

    for (i=0;i<10;i++)
    {
        if (feedContent.docs[i].details==null)
        {
            feedContent.docs[i].details='No details available.';
        }
        feed.innerHTML+=''+
            '<div class="launch">'+
                '<div class="thumbnail" style="background-image: url('+feedContent.docs[i].links.patch.large+'); background-size: contain;"></div>'+
                '<div class="details">'+
                    '<h4>'+feedContent.docs[i].flight_number+': '+feedContent.docs[i].name+' ('+String(feedContent.docs[i].date_utc).slice(0,4)+')</h4>'+
                    '<p>'+feedContent.docs[i].details+'</p>'+
                '</div>'+
            '</div>';
    }

    console.log(dataPage);
}

async function displayAllLaunches(page)
{
    const feed=document.getElementsByClassName('feed')[0];
    if (page==1)
    {
        feed.innerHTML=''+
        '<div class="lazyLoad">'+
            '<div class="thumbnail"></div>'+
            '<div class="lazyDetails">'+
                '<div class="lazyName"></div>'+
                '<div class="lazySub"></div>'+
            '</div>'+
        '</div>';
    }

    response=await fetch(
        'https://api.spacexdata.com/v4/launches/query',
        {
            method: 'POST',
            body:
            {
                options:
                {
                    query:
                    {
                        flight_number:
                        {
                            $gte: page*10-9,
                            $lte: page*10
                        }
                    }
                }
            }
        }
    );

    feedContent=await response.json();
    if (page==1)
    {
        feed.innerHTML='';
    }
    for (i=0;i<10;i++)
    {
        if (feedContent.docs[i].details==null)
        {
            feedContent.docs[i].details='No details available.';
        }
        feed.innerHTML+=''+
            '<div class="launch">'+
                '<div class="thumbnail" style="background-image: url('+feedContent.docs[i].links.patch.large+'); background-size: contain;"></div>'+
                '<div class="details">'+
                    '<h4>'+feedContent.docs[i].flight_number+': '+feedContent.docs[i].name+' ('+String(feedContent.docs[i].date_utc).slice(0,4)+')</h4>'+
                    '<p>'+feedContent.docs[i].details+'</p>'+
                '</div>'+
            '</div>';
    }
}
displayAllLaunches(dataPage++);
console.log(dataPage);

document.addEventListener('keypress',(e)=>{
    if (e.key==='Enter')
    {
        if (lastAccessed==0)
        {
            dataPage=1;
        }
        searchByQuery(document.getElementById('query').value,dataPage++);
        lastAccessed=1;
    }
});

$(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() == $(document).height()) {
        if (lastAccessed==0)
        {
            displayAllLaunches(dataPage++);
        }
        else
        {
            searchByQuery(document.getElementById('query').value,dataPage++);
        }
    }
 });
