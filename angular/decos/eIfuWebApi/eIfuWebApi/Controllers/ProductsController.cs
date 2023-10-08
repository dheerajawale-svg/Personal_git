using Microsoft.AspNetCore.Mvc;

namespace eIfuWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {

        private readonly ILogger<ProductsController> _logger;

        public ProductsController(ILogger<ProductsController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetProducts")]
        public IEnumerable<Ifu> Get()
        {
            List<Ifu> ifus = new();
            ifus.Add(new()
            {
                ProductHeader = "Otosuite Tone Modality",
                ProductFamily = "Audiometry",
                ProductSize = "554.62",
                ReleaseDate = DateOnly.Parse("2015-09-12"),
                ProductLanguage = "English (US)"
            });

            ifus.Add(new()
            {
                ProductHeader = "Otosuite Speech Modality",
                ProductFamily = "Audiometry",
                ProductSize = "500.62",
                ReleaseDate = DateOnly.Parse("2016-02-22"),
                ProductLanguage = "English (US)"
            });

            ifus.Add(new()
            {
                ProductHeader = "Neuroworks EEG",
                ProductFamily = "Neuro",
                ProductSize = "1054",
                ReleaseDate = DateOnly.Parse("2011-04-27"),
                ProductLanguage = "English (US)"
            });

            ifus.Add(new()
            {
                ProductHeader = "SleepWorks",
                ProductFamily = "Neuro",
                ProductSize = "754.12",
                ReleaseDate = DateOnly.Parse("2012-05-23"),
                ProductLanguage = "English (US)"
            });

            ifus.Add(new()
            {
                ProductHeader = "Otobase",
                ProductFamily = "Audiometry",
                ProductSize = "514.50",
                ReleaseDate = DateOnly.Parse("2014-10-01"),
                ProductLanguage = "English (US)"
            });

            return ifus;
        }
    }

    public class Ifu
    {
        public string ProductHeader { get; set; }

        public string ProductFamily { get; set; }

        public string ProductSize { get; set; }

        public string ProductLanguage { get; set; }

        public DateOnly ReleaseDate { get; set; }
    }
}