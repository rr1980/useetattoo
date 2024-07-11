using DevExtreme.AspNet.Data.ResponseModel;
using System.Text.Json;
using Useetattoo.ViewModels;

namespace Useetattoo.Services.Interfaces
{
    public interface IDeclarationService
    {
        Task<DeclarationItemVM> Get(DeclarationItemRequestVM request);
        long? Add(DeclarationItemAddVM request);
        Task Del(DeclarationItemRequestVM request);
        List<DeclarationItemVM> GetAll();
        Task<LoadResult> Search(DataSourceLoadOptions loadOptions);
    }
    
}
