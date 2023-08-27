using EventAggregatorLib;
using Microsoft.AspNetCore.Components;

namespace BlazorConsumer.Pages
{
    public partial class Counter : ISubscriber<string>
    {
        private int currentCount = 0;

        private List<string> _messages = new();

        [Inject]
        IEventAggregator EventAggregator { get; set; }

        public void OnEventHandler(string e)
        {
            _messages.Add(e);
            this.InvokeAsync(() => this.StateHasChanged());
        }

        protected override async Task OnInitializedAsync()
        {            
            EventAggregator.SubsribeEvent(this);

            await Task.Yield();
        }

        private void IncrementCount()
        {
            currentCount++;
        }
    }
}
