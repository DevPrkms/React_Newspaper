import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class CrawlTest {
    public static void main(String[] args) {
        // Jsoup를 이용해서 네이버 뉴스 크롤링
        String url = "https://search.naver.com/search.naver?sm=tab_hty.top&where=news&query=%EC%84%9C%EC%9A%B8+%EA%B0%95%EC%84%9C%EA%B5%AC&oquery=%EB%84%A4%EC%9D%B4%EB%B2%84+%EB%89%B4%EC%8A%A4&tqi=UX9Bvdp0JXossKGHSBsssssstxV-323189"; //크롤링할 url지정
        Document doc = null;        //Document에는 페이지의 전체 소스가 저장된다

        try {
            doc = Jsoup.connect(url).get();
        } catch (IOException e) {
            e.printStackTrace();
        }
        List<String> title = new ArrayList<>();
        List<String> content = new ArrayList<>();
        List<String> article = new ArrayList<>();
        //select를 이용하여 원하는 태그를 선택한다. select는 원하는 값을 가져오기 위한 중요한 기능이다.
        Elements element = doc.select("ul.type01");

        Elements articles = element.select("a._sp_each_title");
        for(Element articlea : articles) {
            String particle = articlea.attr("href");
            if(particle != ""){
                article.add(particle);
            }
        }

        Elements titles = element.select("a._sp_each_title");
        for (Element titlea : titles) {
            String ptitle = titlea.attr("title");
            if(ptitle != "") {
                title.add(ptitle);
            }
        }

        for (int j=0; j<10; j++) {
            String pcontent = element.select("li:nth-child(" + (j+1) + ") dd:nth-child(3)").text();
            if(pcontent != "") {
                content.add(pcontent);
            }
        }
        
        for(int i=0; i<title.size(); i++){
            System.out.println("article : " + article.get(i));
            System.out.println("title : " + title.get(i));
            System.out.println("content : " + content.get(i));
        }
    }
}
