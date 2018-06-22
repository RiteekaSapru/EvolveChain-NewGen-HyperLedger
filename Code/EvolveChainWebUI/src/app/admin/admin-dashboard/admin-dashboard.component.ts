import { ViewChild, Component, ElementRef, OnInit } from '@angular/core';
import { } from 'morris.js';
import { Chart } from 'chart.js';

declare var AdminLTE: any;

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  // donutChart: morris.DonutChart;
  @ViewChild('deviceUsageCanvas') deviceUsageCanvas: ElementRef;
  @ViewChild('countryApplicationsCanvas') countryApplicationsCanvas: ElementRef;
  @ViewChild('ageGroupCanvas') ageGroupCanvas: ElementRef;

  monthlyApplicationsChart: morris.GridChart;
  constructor() {

  }

  ngOnInit() {
    AdminLTE.init();

    this.monthlyApplicationsChart = Morris.Area({
      element: 'monthlyApplicationsChart',
      resize: true,
      data: [
        { m: '2018-01', item1: 2666, item2: 2666 },
        { m: '2018-02', item1: 2778, item2: 2294 },
        { m: '2018-03', item1: 4912, item2: 1969 },
        { m: '2018-04', item1: 3767, item2: 3597 },
        { m: '2018-05', item1: 6810, item2: 1914 },
        { m: '2018 06', item1: 5670, item2: 4293 }
      ],
      xkey: 'm',
      ykeys: ['item1', 'item2'],
      labels: ['Item 1', 'Item 2'],
      lineColors: ['red', 'blue'],
      hideHover: 'auto'
    });

    let deviceCtx = this.deviceUsageCanvas.nativeElement.getContext('2d');

    var data = {
      labels: [
        "Android",
        "iOS"
      ],
      datasets: [
        {
          "data": [101342, 55342],   // Example data
          "backgroundColor": [
            "#1bbc81",
            "#4dc9f6"
          ]
        }]
    };

    var chart = new Chart(
      deviceCtx,
      {
        "type": 'doughnut',
        "data": data,
        "options": {
          "cutoutPercentage": 50,
          "animation": {
            "animateScale": true,
            "animateRotate": false
          }
        }
      }
    );

    let countryCtx = this.countryApplicationsCanvas.nativeElement.getContext('2d');

    var data = {
      labels: [
        "USA",
        "INDIA",
        "CANADA"
      ],
      datasets: [
        {
          "data": [1200, 3000, 1810],   // Example data
          "backgroundColor": [
            "#00ff22",
            "#76a346",
            "#537bc4"
          ]
        }]
    };

    var chart = new Chart(
      countryCtx,
      {
        "type": 'doughnut',
        "data": data,
        "options": {
          "cutoutPercentage": 50,
          "animation": {
            "animateScale": true,
            "animateRotate": false
          }
        }
      }
    );


    var data = {
      labels: [
        "14-25",
        "25-35",
        "35-45",
        "45-55",
        "55-65",
        "65-75",
        "75-85",
        "85-90"
      ],
      datasets: [
        {
          "data": [1200, 200, 300, 100, 75, 89, 10, 3],   // Example data
          "backgroundColor": [
            "#537bc4",
            '#166a8f',
            '#00a950',
            '#58595b',
            '#ff595b',
            '#0059ff',
            '#00ff22',
            '#555555'
          ]
        }]
    };
    let ageGroupCtx = this.ageGroupCanvas.nativeElement.getContext('2d');
    var chart = new Chart(
      ageGroupCtx,
      {
        "type": 'doughnut',
        "data": data,
        "options": {
          "cutoutPercentage": 50,
          "animation": {
            "animateScale": true,
            "animateRotate": false
          }
        }
      }
    );
  }
}


