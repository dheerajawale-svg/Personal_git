using System;

namespace MsgContracts
{
    public class DecosQ
    {
        public DecosQ()
        {
            Id = Guid.NewGuid();
        }

        public Guid Id { get; set; }
        public string Message { get; set; }
    }
}