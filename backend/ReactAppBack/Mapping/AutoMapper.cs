using AutoMapper;
using DTOs;
using Models;

namespace ReactAppBack.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Exam, EditDTO>()
                .ForMember(dest => dest.Schedule,
                    opt => opt.MapFrom(src => src.TermData));

            CreateMap<ExamDTO, Exam>()
                .ForMember(dest => dest.TermData, opt => opt.MapFrom(src => src.Schedule));
            
            CreateMap<EditDTO, Exam>()
                .ForMember(dest => dest.TermData, opt => opt.MapFrom(src => src.Schedule));

            CreateMap<Deadline, DeadlineDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ID));

            CreateMap<User, RegLogUser>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));
        }
    }
}

