using dataAccess.Models;

namespace service;

public class PaperService
{
    
    public List<Paper> MyPapers { get; set; } = new List<Paper>();

    public List<Paper> GetAllPapers()
    {
        return MyPapers;
    }
        
    public Paper AddPaper(Paper Paper)
    {
        MyPapers.Add(Paper);
        return Paper;
    }
    
    
}