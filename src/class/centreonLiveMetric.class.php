<?php
/**
 * Copyright 2005-2019 Centreon
 * Centreon is developped by : Julien Mathis and Romain Le Merlus under
 * GPL Licence 2.0.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation ; either version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, see <http://www.gnu.org/licenses>.
 *
 * Linking this program statically or dynamically with other modules is making a
 * combined work based on this program. Thus, the terms and conditions of the GNU
 * General Public License cover the whole combination.
 *
 * As a special exception, the copyright holders of this program give Centreon
 * permission to link this program with independent modules to produce an executable,
 * regardless of the license terms of these independent modules, and to copy and
 * distribute the resulting executable under terms of Centreon choice, provided that
 * Centreon also meet, for each linked independent module, the terms  and conditions
 * of the license of that module. An independent module is a module which is not
 * derived from this program. If you modify this program, you may extend this
 * exception to your version of the program, but you are not obliged to do so. If you
 * do not wish to do so, delete this exception statement from your version.
 *
 * For more information : contact@centreon.com
 *
 */

 /*
  * this class requires others
  */
  require_once "../require.php";
  require_once $centreon_path . 'www/class/centreon.class.php';
  require_once $centreon_path . 'www/class/centreonSession.class.php';
  require_once $centreon_path . 'www/class/centreonWidget.class.php';
  require_once $centreon_path . 'www/class/centreonDuration.class.php';
  require_once $centreon_path . 'www/class/centreonUtils.class.php';
  require_once $centreon_path . 'www/class/centreonACL.class.php';
  require_once $centreon_path . 'www/class/centreonHost.class.php';
  require_once $centreon_path . 'bootstrap.php';

/**
 * Class for retrieving metrics data
 */
class  CentreonLiveMetric
{

    protected $dependencyInjector;
    protected $centreon;
    protected $widgetId;
    protected $grouplistStr;

    public function __construct($dependencyInjector, $centreon, $widgetId)
    {
        $this->centreon = $centreon;
        $this->widgetId = $widgetId;
        $this->dependencyInjector = $dependencyInjector;
        $grouplistStr = '';
    }

    public function getPreferences()
    {
        try {
            $db_centreon = $this->dependencyInjector['configuration_db'];
            $widgetObj = new CentreonWidget($this->centreon, $db_centreon);
            $preferences = $widgetObj->getWidgetPreferences($this->widgetId);
            $autoRefresh = 0;
            if (isset($preferences['refresh_interval'])) {
                $autoRefresh = $preferences['refresh_interval'];
            }
        } catch (Exception $e) {
            echo $e->getMessage() . "<br/>";
            exit;
        }

        foreach ($preferences as $key => $value) {
            $value = centreonUtils::escapeAll($value);
            $preferences[$key] = $value;
        };

        return $preferences;
    }

    public function getMetrics()
    {

        $preferences = $this->getPreferences();

        $query = "SELECT SQL_CALC_FOUND_ROWS i.host_name,
        	i.service_description AS serviceDescription,
        	i.service_id AS serviceId,
        	i.host_id AS hostId,
        	m.current_value AS currentValue,
        	s.state AS status,
        	m.unit_name AS unit,
        	m.warn AS warning,
        	m.crit AS critical,
            m.max ";

        $query .= " FROM metrics m,
        	hosts h"
             .($preferences['host_group'] ? ", hosts_hostgroups hg " : "")
             .($this->centreon->user->admin == 0 ? ", centreon_acl acl " : "")
             ." , index_data i "
             ."LEFT JOIN services s ON s.service_id  = i.service_id AND s.enabled = 1";

        $query .= " WHERE i.service_description LIKE '%".$preferences['service_description']."%' "
             ."AND i.id = m.index_id "
             ."AND m.metric_name LIKE '%".$preferences['metric_name']."%' "
             ."AND i.host_id = h.host_id ";

        if (isset($preferences['host_group']) && $preferences['host_group']) {
        	$results = explode(',', $preferences['host_group']);
        	$queryHG = '';
        	foreach ($results as $result) {
        		if ($queryHG != '') {
        			$queryHG .=', ';
        		}
                $queryHG .= ":id_" . $result;
                $mainQueryParameters[] = [
                	'parameter' => ':id_' . $result,
                	'value' => (int)$result,
                	'type' => PDO::PARAM_INT
                ];
        	}
        	$hostgroupHgIdCondition = "hg.hostgroup_id IN (" . $queryHG . ") "
        	."AND i.host_id = hg.host_id";

        	$query = CentreonUtils::conditionBuilder($query, $hostgroupHgIdCondition);

        }

        // filter data depending on user's acl
        if ($this->centreon->user->admin == 0) {
            $query .="AND i.host_id = acl.host_id "
                ."AND i.service_id = acl.service_id "
                ."AND acl.group_id IN (" .($grouplistStr != "" ? $grouplistStr : 0). ")";
        }

        // for the sake of performance, we limit the number of results
        if ($preferences['nb_line'] > 15) {
            $preferences['nb_line'] = 15;
        }

        $query .="AND s.enabled = 1 "
             ."AND h.enabled = 1 "
             ."AND s.perfdata != '' "
             ."GROUP BY i.host_id "
             ."ORDER BY current_value DESC "
             ."LIMIT ".$preferences['nb_line'].";";

        // sending sql query
        $db = $this->dependencyInjector['realtime_db'];
        $res = $db->prepare($query);
        foreach ($mainQueryParameters as $parameter) {
            $res->bindValue($parameter['parameter'], $parameter['value'], $parameter['type']);
        }

        try {
            $res->execute();
        } catch (\Exception $e) {
            $template->assign('error', $e->getMessage());
        }
        $file = fopen("/var/opt/rh/rh-php71/log/php-fpm/widget", "w") or die ("Unable to open file!");
fwrite($file, print_r($res,true));
fclose($file);
        while ($row = $res->fetch()) {
            $chartData[] = $row;
        }
        $chartData['rowCount'] = $res->rowCount();

        return $chartData;
    }
}
