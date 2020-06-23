package newspaper.back.Controller;

import newspaper.back.news.News;
import newspaper.back.news.NewsRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class ApiController {

    @Autowired
    NewsRepository newsRepository;

    @RequestMapping(value = "test")
    public String test() {
        return "Hello";
    }

    static int cocnt = 0;

    @RequestMapping(value = "/newscrawl", method = RequestMethod.GET)
    @ResponseBody
    public List<News> newscrawl(HttpServletRequest request, HttpServletResponse response) {
        // Jsoup를 이용해서 네이버 뉴스 크롤링
        String search_query = request.getParameter("address");
        int page = Integer.parseInt(request.getParameter("page"));
        System.out.println(page);
        int size = 10;
        int startcnt = 1;

        List<String> title = new ArrayList<>();
        List<String> content = new ArrayList<>();
        List<String> article = new ArrayList<>();

        newsRepository.deleteAll();

        for (int cnt = 0; cnt < 3; cnt++) {
            String url = "https://search.naver.com/search.naver?&where=news&query=" + search_query + "&sm=tab_pge&sort=0&photo=0&field=0&reporter_article=&pd=0&ds=&de=&docid=&nso=so:r,p:all,a:all&mynews=0&cluster_rank=35&start=" + startcnt + "&refresh_start=0"; //크롤링할 url지정
            Document doc = null;        //Document에는 페이지의 전체 소스가 저장된다

            try {
                doc = Jsoup.connect(url).get();
            } catch (IOException e) {
                e.printStackTrace();
            }
            //select를 이용하여 원하는 태그를 선택한다. select는 원하는 값을 가져오기 위한 중요한 기능이다.
            Elements element = doc.select("ul.type01");

            Elements articles = element.select("a._sp_each_title");
            for (Element articlea : articles) {
                String particle = articlea.attr("href");
                if (particle != "") {
                    article.add(particle);
                }
            }

            Elements titles = element.select("a._sp_each_title");
            for (Element titlea : titles) {
                String ptitle = titlea.attr("title");
                if (ptitle != "") {
                    title.add(ptitle);
                }
            }

            for (int j = 0; j < 10; j++) {
                String pcontent = element.select("li:nth-child(" + (j + 1) + ") dd:nth-child(3)").text();
                if (pcontent != "") {
                    content.add(pcontent);
                }
            }
            startcnt = startcnt + 10;
        }

        for(int i=0; i<title.size(); i++){
            News news = new News();
            news.setArticle(article.get(i));
            news.setTitle(title.get(i));
            news.setContents(content.get(i));
            newsRepository.save(news);
        }

        List<News> rList = new ArrayList<>();
        PageRequest pageRequest = PageRequest.of(page, size);
        rList = newsRepository.findAll(pageRequest).toList();

        return rList;
    }
}
