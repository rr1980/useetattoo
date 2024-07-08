using DevExtreme.AspNet.Data.ResponseModel;
using System.Text.Json;
using Useetattoo.ViewModels;

namespace Useetattoo.Services.Interfaces
{
    public interface IDeclarationService
    {
        List<DeclarationItemVM> GetAll();
        long? Add(DeclarationItemAddVM request);
        Task<LoadResult> Search(DataSourceLoadOptions loadOptions);
    }
    
}
